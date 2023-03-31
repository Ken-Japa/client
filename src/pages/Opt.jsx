import React, { useState, useEffect } from 'react'

function Opt() {
    const [jsonData, setJsonData] = useState([])

    useEffect(() => {
    fetch('./src/constants/SI_D_SEDE.txt')
  .then(response => response.text())
  .then(text => {
    const lines = text.split('\n');
    const header = ['1', 'EMPRESA', '3', 'CALLouPUT', '5', '6', 'CODEMPRESA', 'ONouPN', '9','10','11','12','13','CODOPCAO','15', 'TIPO', 'STRIKE', 'DATA','19'];
    lines[0] = header;

    const data = lines.slice(1).map((line, index) => {
      const values = line.split('|');
      const dateStr = values[17];
      const year = dateStr && dateStr.length >= 4 ? parseInt(dateStr.substr(0, 4)) : 0;
      const month = convertToMonthString(dateStr && dateStr.length >= 6 ? parseInt(dateStr.substr(4, 2)) - 1 : 0);
      const day = dateStr && dateStr.length >= 8 ? parseInt(dateStr.substr(6, 2)) : 0;
      const date = `${day}-${month}-${year}`
      return {
        ID: `row_${index}`,
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
    setJsonData(data)
  });
}, [])

function convertToMonthString(monthNumber) {
  const months = [
    'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return months[monthNumber]
}

return (
    <div>
      <h1>JSON Data</h1>
      <pre>{JSON.stringify(jsonData, ['EMPRESA', 'CODEMPRESA', 'CALLouPUT', 'ONouPN', ' TIPO', ' CODOPCAO','STRIKE', 'DATA'], 2)}</pre>
    </div>
  )
}

export default Opt