// Copia final de OPT5
import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import {close} from '../assets'

function Opt4() {

    const [jsonData, setJsonData] = useState([]);
    const [EmpresaSelecionada, setEmpresaSelecionada] = useState('');
    const [selectedButtons, setSelectedButtons] = useState([]);
    const [slctButtonsONPN, setSlctButtonsONPN] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showTab, setShowTab] = useState(false);

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
      })
    }, [])
      if (!jsonData) {return <div>Loading...</div>;}

      //Atualizando Empresas
    const Empresas = [...new Set(jsonData.map((o) => (o.EMPRESA))).values()].sort(function(a,b){return a.localeCompare(b)});  

    // Filtrando Data com a Empresa Selecionada - Fazendo ordenamento segundo Strike e Vencimento
    const filteredData = jsonData.filter((item) => {return EmpresaSelecionada ? item.EMPRESA === EmpresaSelecionada : false; })
    .sort ((c,d)=>(c.STRIKE > d.STRIKE ? 1: d.STRIKE > c.STRIKE ?-1: 0))
    .sort((a,b)=>{var a1 = a.DATA.split('/');var b1 = b.DATA.split('/');
      if(a1[2] > b1[2]){return 1;}else if(a1[2] < b1[2]){return -1;}
      else if(a1[1] > +b1[1]){return 1;}else if(a1[1] < b1[1]){return-1;}else if (a1[0] > b1[0]){return 1;}else if(a1[0] < +b1[0]){return-1;}}
      );

    //Armazenando botoes de vencimentos ativos
    const handleButtonClick = (value) => {
      const index = selectedButtons.indexOf(value);
      if (index === -1) {setSelectedButtons([...selectedButtons, value])} 
      else {setSelectedButtons(selectedButtons.filter((item) => item !== value))}
    };
  
        //Botoes de ON-PN ativos
    const handleButtonClick2 = (value) => {
      const index2 = slctButtonsONPN.indexOf(value);
      if (index2 === -1) {setSlctButtonsONPN([...slctButtonsONPN, value])} 
      else {setSlctButtonsONPN(slctButtonsONPN.filter((item) => item !== value))}
    };

    //Filtrando Data com Vencimentos selecionados
    const filterData = () => {
      let filtered = filteredData;
      if (selectedButtons.length > 0) {
        filtered = filteredData.filter((item) =>
        selectedButtons.includes(item.DATA))
      }
      return filtered;
    };

    //Filtrando ON-PN ja com data filtrada
    const filterDataVOP = () => {
      let filtere = filterData();
      if (slctButtonsONPN.length > 0) {
        filtere = filterData().filter((item) =>
        slctButtonsONPN.includes(item.ONouPN))
      }
      return filtere;
    };

    //Row Select
    const handleRowClick = (id) => {
      if (selectedRow !== null) {
        setSelectedRow(null);
        setShowTab(false);
        document.querySelector('.tables').classList.remove('blurry');
      } else {
        setSelectedRow(id);
        setShowTab(true);
        document.querySelector('.tables').classList.add('blurry');
      }
    };
    
    let selectedRowDetails = null;
    if (selectedRow) {
    const selectedItem = filterDataVOP().find((item) => item.id === selectedRow)
    selectedRowDetails = selectedItem}
    
    ///// RETURN
  return (<div>

    {/* Header com Selecionador de Empresa */}
    <header className="flex justify-center">
      <select className="border rounded-md shadow-sm" value={EmpresaSelecionada} 
        onChange={(e)=>{setEmpresaSelecionada(e.target.value)
                        setSelectedButtons([])
                        setSlctButtonsONPN([])}}>
          <option value=""> -- Selecione a empresa -- </option>                       
              {Empresas.map(displaydata => (
              <option key={displaydata} value={displaydata}>
              {displaydata}
              </option>))}
      </select>
    </header>
                <br/>
    {/* Botoes com Vencimento - Verifica se Empresa Selecionada nao esta vazia */}
    {EmpresaSelecionada && (<div className=" border  items-center  space-x-4 space-y-2 shadow-xl"> 
    {Empresas.filter((emp) => emp === EmpresaSelecionada)
      .map((emp) =>[...new Set(filteredData.map((o) => o.DATA))]
        .filter((data) => filteredData.some((item) => item.DATA === data && item.EMPRESA === emp))
        .map((data) => (<button
            key={uuidv4()}
            type="button"
            className={`ml-4 w-40 border bg-blue-500 text-white font-inter rounded-md font-medium hover:bg-[#16b0a1] 
              ${selectedButtons.includes(data) ? "bg-black font-bold" : "btn-outline-primary"}`}
            onClick={() => handleButtonClick(data)}>
            {data}
            </button>))
      )}
    </div>)}
    <br/>
    {/* Botoes ON-PN */}
        {EmpresaSelecionada && (<div className=" border  items-center bg-[white] space-x-4 space-y-2 shadow-xl">
        {Empresas.filter((emp) => emp === EmpresaSelecionada)
          .map((emp) =>[...new Set(filteredData.map((o) => o.ONouPN))]
            .filter((data) => filteredData.some((item) => item.ONouPN === data && item.EMPRESA === emp))
            .map((data) => (<button
            key={uuidv4()}
            type="button"
            className={`ml-4 w-40 border bg-blue-300 font-inter rounded-md font-medium hover:bg-[#16b0a1] hover:text-white
              ${slctButtonsONPN.includes(data) ? "bg-black text-red-600 font-bold" : "btn-outline-primary"}`}
            onClick={() => handleButtonClick2(data)}>
            {data}
            </button>))
      )}
    </div>)}
    {/* Tabelas */} 
      <div className='tables'>
        <br /><strong className="mt-3 flex justify-center font-inter text-[37px] text-blue-600 rounded-md ">
        Tabela Call
        </strong><br />
        {/* Tabela Call */}
          <table className="table table-striped table-info table-hover border shadow-2xl table-auto flex ">
          <thead className="thead-dark text-center">
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
          <tbody className="text-center">
            {filterDataVOP()
            .filter((i) => {return EmpresaSelecionada ? i.CALLouPUT === 'OPCOES COMPRA' : true; })
            .map((item) => (
              <tr key={item.id} onClick={() => handleRowClick(item.id)} className={selectedRow === item.id ? 'selected-row' : ''}>
                <td>{item.EMPRESA}</td>
                <td>{item.CODEMPRESA}</td>
                <td>{item.TIPO}</td>
                <td>{item.ONouPN}</td>
                <td>  <span>{item.CODOPCAO.slice(0, 4)}</span>
                      <span style={{color: 'red', fontWeight: 'bold'}}>{item.CODOPCAO.charAt(4)}</span>
                      <span style={{color: 'red',fontWeight: 'bold'}}>{item.CODOPCAO.slice(5)}</span></td>
                <td>{item.STRIKE}</td>
                <td>{item.DATA}</td>
              </tr>))}
          </tbody>
          </table>


        <br /><br /><strong className="flex justify-center font-inter text-[37px] text-yellow-500 rounded-md  ">
        Tabela Put
        </strong><br />
        {/* Tabela Put */}
        <table className="table table-striped table-warning table-hover border shadow-2xl">
          <thead className="thead-dark text-center">
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
          <tbody className="text-center" >
          {filterDataVOP()
          .filter((i) => {return EmpresaSelecionada ? i.CALLouPUT === 'OPCOES VENDA' : true; })
          .map((item) => (
            <tr key={item.id} onClick={() => handleRowClick(item.id)} className={selectedRow === item.id ? 'selected-row' : ''}>
              <td>{item.EMPRESA}</td>
              <td>{item.CODEMPRESA}</td>
              <td>{item.TIPO}</td>
              <td>{item.ONouPN}</td>
              <td> <span>{item.CODOPCAO.slice(0, 4)}</span>
                  <span style={{color: 'red', fontWeight: 'bold'}}>{item.CODOPCAO.charAt(4)}</span>
                  <span style={{color: 'red',fontWeight: 'bold'}}>{item.CODOPCAO.slice(5)}</span></td>
              <td>{item.STRIKE}</td>
              <td>{item.DATA}</td>
            </tr>))}
          </tbody>
        </table>

      </div>

      {/*Tab render*/}
      {showTab && selectedRowDetails && (<div className="tab shadow-2xl">
          <img src={close} alt="close" className="w-6 absolute top-1 right-1 hover:cursor-pointer" onClick={()=>{setSelectedRow(null);setShowTab(false);document.querySelector('.tables').classList.remove('blurry')}}/>
        <header className="flex-col text-center font-inter"><br/>
          <div className="flex-row"><h1 className="font-bold ">{selectedRowDetails.EMPRESA} <span className="font-normal mt-1"> - {selectedRowDetails.CODEMPRESA}</span></h1></div>
          <h2 className="text-red-500">{selectedRowDetails.ONouPN}</h2>
        </header> 
        <div className=" flex-col border border-black text-center font-inter mt-3 bg-[#D8e5f5]">
          <h1 className="text-blue-700 font-bold"><span>{selectedRowDetails.CODOPCAO.slice(0,4)}</span>
            <span style={{color:'red'}}>{selectedRowDetails.CODOPCAO.slice(4)}</span>
          </h1>
          <h1 className="font-normal mt-1">{selectedRowDetails.CALLouPUT}</h1>
          <h1 className="text-blue-700 font-normal mt-1">{selectedRowDetails.TIPO}</h1>
          <h1 className="font-bold mt-1"> Strike : {selectedRowDetails.STRIKE}</h1>
          <h1 className="text-[#e30d16] font-bold mt-1"> Vencimento : {selectedRowDetails.DATA}</h1>

        </div>
        <button className="border bg-blue-500 text-white w-40 mt-3 rounded-md float-right">Adicionar</button>
      </div>)}
      
  </div>
    
    
  )
}
export default Opt4