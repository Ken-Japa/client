// teste de tabela
import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import { Button } from 'primereact/button';


function Opt3() {

    const [jsonData, setJsonData] = useState([]);
    const [EmpresaSelecionada, setEmpresaSelecionada] = useState('');
    const [selectedButtons, setSelectedButtons] = useState([]);
 
    //Consumindo dados para DB
    useEffect(() => {
    fetch('./src/constants/SI_D_SEDE.txt')
    .then(response => response.text())
    .then((text) => {
    const lines = text.split('\n');
    const header = ['1', 'EMPRESA', '3', 'CALLouPUT', '5', '6', 'CODEMPRESA', 'ONouPN', '9','10','11','12','13','CODOPCAO','15', 'TIPO', 'STRIKE', 'DATA','19'];
    lines[0] = header;

      const data =  lines.slice(1).map((line, index) => {
      const values = line.split('|');
      const dateStr = values[17];
      const year = dateStr && dateStr.length >= 4 ? parseInt(dateStr.substr(0, 4)) : 0;
      const month = dateStr && dateStr.length >= 6 ? parseInt(dateStr.substr(4, 2)) : 0; 
      const day = dateStr && dateStr.length >= 8 ? parseInt(dateStr.substr(6, 2)) : 0;
      const date = `${day}/ ${month}/ ${year}`;
      return {
        id: `row_${index}`,
        EMPRESA: values[1],
        CODEMPRESA: values[6]? values[6].trim() : '',
        CALLouPUT: values[3],
        ONouPN: values[7],
        TIPO: values[15],
        CODOPCAO: values[13]? values[13].trim() : '',
        STRIKE: parseFloat(values[16]).toFixed(2),
        DATA: date,
        };
        });
      setJsonData(data);
      console.log(jsonData)
    })
    }, [])
        if (!jsonData) {return <div>Loading...</div>;}

    //Atualizando Empresas
    const Empresas = [...new Set(jsonData.map((o) => (o.EMPRESA))).values()].sort(function(a,b){return a.localeCompare(b)});  

    // Filtrando Data com a Empresa Selecionada - Fazendo ordenamento segundo Strike e Vencimento
    const filteredData = jsonData.filter((item) => {return EmpresaSelecionada ? item.EMPRESA === EmpresaSelecionada : false;})
      .sort ((c,d)=>(c.STRIKE > d.STRIKE ? 1: d.STRIKE > c.STRIKE ?-1: 0))
      .sort((a,b)=>{var a1 = a.DATA.split('/');var b1 = b.DATA.split('/');
        if(a1[2] > b1[2]){return 1;}else if(a1[2] < b1[2]){return -1;}
        else if(a1[1] > +b1[1]){return 1;}else if(a1[1] < b1[1]){return-1;}else if (a1[0] > b1[0]){return 1;}else if(a1[0] < +b1[0]){return-1;}}
        );

    const uniqueDataValues = [...new Set(filteredData.map((o) => (o.DATA)))]
      .sort((a,b)=>{var a1 = a.split('/');var b1 = b.split('/');
        if(a1[2] > b1[2]){return 1;}else if(a1[2] < b1[2]){return -1;}
        else if(a1[1] > +b1[1]){return 1;}else if(a1[1] < b1[1]){return-1;}else if (a1[0] > b1[0]){return 1;}else if(a1[0] < +b1[0]){return-1;}})
      .map((date) => (<option key={date} value={date}>
          {date}
          </option>))

////
    const handleButtonClick = (value) => {
      const index = selectedButtons.indexOf(value);
      if (index === -1) {
      setSelectedButtons([...selectedButtons, value])} 
      else {setSelectedButtons(selectedButtons.filter((item) => item !== value))}
    };

    const filterData = () => {
    let filtered = filteredData;
    if (selectedButtons.length > 0) {
    filtered = filteredData.filter((item) =>
      selectedButtons.includes(item.DATA))}
    return filtered}

//
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    // RETURN
  return (

  <div> 
    <header className="flex justify-center">
      <select className="border rounded-md shadow-sm" value={EmpresaSelecionada} onChange={(e)=>{setEmpresaSelecionada(e.target.value)}}>
                <option value=""> -- Selecione a empresa -- </option>                       
                {Empresas.map(displaydata => (<option key={displaydata} value={displaydata}>
                {displaydata}
                </option>))}
      </select>
    </header>

  {EmpresaSelecionada && (
    <div className="w-full border space-x-4 space-y-2 mt-3 shadow-xl"> <br />
    {Empresas.filter((emp) => emp === EmpresaSelecionada).map((emp) =>
      [...new Set(filteredData.map((o) => o.DATA))]
        .filter((data) =>
          filteredData.some((item) => item.DATA === data && item.EMPRESA === emp)
        )
        .map((data) => (
          <button
            key={uuidv4()}
            type="button"
            className={`ml-4 w-40 border bg-blue-500 text-white font-inter rounded-md font-medium hover:bg-[#16b0a1] ${
              selectedButtons.includes(data) ? "bg-black font-bold" : "btn-outline-primary"
            }`}
            onClick={() => handleButtonClick(data)}
          >
            {data}
          </button>
        ))
    )}
  </div>)}

    <div>
    <br /><strong className="mt-3 flex justify-center font-inter text-2xl rounded-md ">Tabela Call</strong><br />

          <div className=" flex justify-center ">
          <DataTable className= "table-auto" value={filterData().filter((i) => {return EmpresaSelecionada ? i.CALLouPUT === 'OPCOES COMPRA' : true; })} 
          showGridlines stripedRows removableSort paginator rows={20} rowsPerPageOptions={[20, 40, 65, 100]} 
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                <Column field="EMPRESA" header="Empresa" className="justify-center "/>
                <Column field="CODEMPRESA" header="Codigo da Empresa" ></Column>
                <Column field="TIPO" header="Tipo de Opcao"></Column>
                <Column field="ONouPN" header="ON ou PN" ></Column>
                <Column field="CODOPCAO" header="Codigo da Opcao" sortable className="self-center"></Column>
                <Column field="STRIKE" header="Strike" sortable ></Column>
                <Column field="DATA" header="Vencimento" sortable ></Column>
            </DataTable>
            </div>

    <br /><br /><strong className="flex justify-center font-inter text-2xl ">Tabela Put</strong><br />

    <table className="table table-striped table-warning table-hover border shadow-2xl">
      <thead className="thead-dark">
        <tr>
          <th>Empresa</th>
          <th>Codigo da Empresa</th>
          <th>Tipo Opcao</th>
          <th>ON ou PN</th>
          <th>Codigo da Opcao</th>
          <th>Strike</th>
          <th>Vencimento</th>
        </tr>
      </thead>
      <tbody >
      {filterData()
      .filter((i) => {return EmpresaSelecionada ? i.CALLouPUT === 'OPCOES VENDA' : true; }).map((item) => (
          <tr key={item.id}>
            <td>{item.EMPRESA}</td>
            <td>{item.CODEMPRESA}</td>
            <td>{item.TIPO}</td>
            <td>{item.ONouPN}</td>
            <td> 
              <span>{item.CODOPCAO.slice(0, 4)}</span>
              <span style={{color: 'red', fontWeight: 'bold'}}>{item.CODOPCAO.charAt(4)}</span>
              <span style={{color: 'red',fontWeight: 'bold'}}>{item.CODOPCAO.slice(5)}</span></td>
            <td>{item.STRIKE}</td>
            <td>{item.DATA}</td>
          </tr>
        ))}
      </tbody>
    </table>

    </div>
  </div>
    
    
    )
}
export default Opt3