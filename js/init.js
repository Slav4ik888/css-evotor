"use strict";


function parseData() {
    
    // принимаем текст и маркируем конец строки ***
    let str1 = document.getElementById('arrFrom').value;
    console.log('str1: ', str1);
    let str2 = str1.replace(/\n/g, '***'); // добавляем **** в конце строки
    
    console.log('str2: ', str2);
  
    let arr = [];
    let smallArr = [];
    let obj = {};
    let resStr = '';
    let exit = false;
  
    // Запускаем цикл преобразование полученных данных в строки
    while (exit === false) {
        //если дошли до последней строки
        if ( str2.indexOf('***') === -1 ) {
            exit = true; 
        }

        // Делим на строки
        resStr = str2.slice(0, str2.indexOf('***'));
        console.log('resStr: ', resStr);
        str2 = str2.slice(str2.indexOf('***') +3 );// удаляем его из строки

        // разбиваем строку на слова, будущие ячейки
        while (true) {
            //если дошли до последнего слова
            if ( resStr.indexOf(';') === -1 ) {
                smallArr.push(resStr.slice(0));
                break; 
            }
            
            smallArr.push(resStr.slice(0, resStr.indexOf(';')));
            // console.log('smallArr: ', smallArr);
            resStr = resStr.slice(resStr.indexOf(';')+1);
        }


        arr.push(smallArr); // результат obj добавляем в массив
        obj = {};
        smallArr = [];
        
    }
    console.log('arr: ', arr);
    return arr;
}

/**************************************/
/*               СБОРКА               */
/**************************************/

function init() {

    let arr = parseData();
    let table;

    // Формируем  таблицу
    const storage = document.querySelector('.storage');
    table = collectTable(arr);
    storage.insertAdjacentHTML('beforeend', table);
    // Прочитать все объекты из базы 
    // добавить к ним ID и вывести все строки
    // let str = "";
    // for(let item of  arr) {
    //     str += `{siteID: '${item.siteID}', project: '${item.project}', organization: '${item.organization}'}, <br/>`;
    // }
    // document.getElementById('res').innerHTML = str;

}


// собирает таблицу с итоговыми результатами из arr
function collectTable( arr ) {
    let table = `<table>`;
    
    for(let item of arr) { // строки
        table += `<tr>`;
        for(let cell of item) { // ячейки
            table += `<td>${cell}</td>`;
        }
        table += `</tr>`;
    }
    
    // закрыть таблицу
    table += '</table>';
    return table;
}
