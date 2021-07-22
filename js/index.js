"use strict";


/**************************************/
/*         ИНИЦИАЛИЗАЦИЯ              */
/**************************************/


const resultTable = document.querySelector(`.result-table`);
const storage = document.querySelector(`.storage`);

// Рабочий массив с данными
let WORK_DATA = [];

// Данные из банковского реестра
let BANK_RESULT = {
  count: 0, // Кол-во строк
  sum: 0, // Общая сумма платежей
};


/**************************************/
/*          ОБРАБОТКА ДАННЫХ          */
/**************************************/


// Обрабатываем последнюю итоговую строку сберовского реестра
const processBankResult = (arr) => {
  const bankResult = arr[arr.length - 1];
  BANK_RESULT.count = parseInt(bankResult[0].replace(`=`, ``));
  BANK_RESULT.sum = parseInt(bankResult[1]);
  console.log('BANK_RESULT: ', BANK_RESULT);

  return arr.slice(0, arr.length - 1);
};


/**
 * Получает исходный текст, делит его по строкам и ячейкам
 * и возвращает в виде массива строк
 * 
 * @param {string} value 
 * @returns {array}
 */
const parseData = (value) => {
    
  // принимаем текст и маркируем конец строки ***
  // let str1 = document.getElementById('arrFrom').value; // ARCHIVE
  let str1 = value;
  // console.log('str1: ', str1);

  let str2 = str1.replace(/\n/g, '***'); // добавляем **** в конце строки
  // console.log('str2: ', str2);
  
  let arr = [];
  let smallArr = [];
  let obj = {};
  let resStr = '';
  let exit = false;
  
  // Запускаем цикл преобразование полученных данных в строки
  while (exit === false) {
    //если дошли до последней строки
    if (str2.indexOf('***') === -1) {
      exit = true;
    }

    // Делим на строки
    resStr = str2.slice(0, str2.indexOf('***'));
    // console.log('resStr: ', resStr);

    str2 = str2.slice(str2.indexOf('***') + 3);// удаляем его из строки

    // разбиваем строку на слова, будущие ячейки
    while (true) {
      //если дошли до последнего слова
      if (resStr.indexOf(';') === -1) {
        smallArr.push(resStr.slice(0));
        break;
      }
      
      smallArr.push(resStr.slice(0, resStr.indexOf(';')));
      // console.log('smallArr: ', smallArr);
      resStr = resStr.slice(resStr.indexOf(';') + 1);
    }


    arr.push(smallArr); // результат obj добавляем в массив
    obj = {};
    smallArr = [];
  }

  // console.log('arr: ', arr);
  return arr;
};


// Парсит полученные данные из файла
// и выводит итог на экран
const parseContent = (content) => {
  WORK_DATA = [...parseData(content)];
  WORK_DATA = [...processBankResult(WORK_DATA)];

  showTable(WORK_DATA);

  const downloadFile = document.querySelector(`.download-file`);
  downloadFile.addEventListener(`click`, createAndDownloadCSVFile);
};

/**************************************/
/*         ИТОГОВАЯ ТАБЛИЦЫ           */
/**************************************/

const HEADER = [`Дата`, `Время`, `Код банка`, `---`, `---`, `---`, `ФИО`, `---`, `---`, `---`, `Сумма`, `Сумма (без НДС)`, `НДС`, `---`];

/**
 * Возвращаем заголовки для таблицы
 * @param {Array} str 
 */
const createTableHead = (str) => {
  let head = ``;

  head += `<thead>`;
  head += `<tr>`;
  str.forEach((_, i) => {
    switch (i) {
      case 0: head += `<th>${HEADER[0]}</th>`; break;
      case 1: head += `<th>${HEADER[1]}</th>`; break;
      case 2: head += `<th>${HEADER[2]}</th>`; break;
      case 3: head += `<th>${HEADER[3]}</th>`; break;
      case 4: head += `<th>${HEADER[4]}</th>`; break;
      case 5: head += `<th>${HEADER[5]}</th>`; break;
      case 6: head += `<th>${HEADER[6]}</th>`; break;
      case 7: head += `<th>${HEADER[7]}</th>`; break;
      case 8: head += `<th>${HEADER[8]}</th>`; break;
      case 9: head += `<th>${HEADER[9]}</th>`; break;
      case 10: head += `<th>${HEADER[10]}</th>`; break;
      case 11: head += `<th>${HEADER[11]}</th>`; break;
      case 12: head += `<th>${HEADER[12]}</th>`; break;
      default: head += `<th>${HEADER[13]}</th>`;
    }
  });
  head += `</tr>`;
  head += `</thead>`;

  return head;
};


// собирает таблицу с итоговыми результатами из arr
const collectTable = (arr) => {
  if (!arr?.length) return null;

  let table = `<table>`;
  table += createTableHead(arr[0]);
  
  for (let item of arr) { // строки
    table += `<tr>`;
    for (let cell of item) { // ячейки
      table += `<td>${cell}</td>`;
    }
    table += `</tr>`;
  }
    
  // закрыть таблицу
  table += '</table>';
  return table;
};


/**
 * Выводим на экран таблицу
 * @param {Array} arr 
 */
const showTable = (arr) => {
  // Формируем  таблицу
  const table = collectTable(arr);
  resultTable.classList.remove(`hide`);

  storage.insertAdjacentHTML('beforeend', table);
};


/**************************************/
/*    ЗАГРУЗКА И ОБРАБОТКА ФАЙЛА      */
/**************************************/

const addFile = document.querySelector(`.add-file`);

const readFile = (e) => {
  let selectedFile = addFile.files[0];

  const reader = new FileReader();
  reader.onload = function (e) {
    const fileContent = e.target.result;
    parseContent(fileContent);
  }

  reader.readAsText(selectedFile);
};

addFile.addEventListener(`change`, readFile);


/**************************************/
/*          СОХРАНЕНИЕ ФАЙЛА          */
/**************************************/


// Возвращает массив в CSV формате
const createCSV = (arr) => {
  // Возвращает строку для CSV
  const getStrCSV = (strArr) => strArr.map(el => `"${el}"`).join(`;`) + "\r\n";

  return [
    getStrCSV(HEADER),
    ...arr.map(getStrCSV)
  ];
};


// Создаёт CSV file
const createCSVFile = (arr) => new File(createCSV(arr), "data-for-evotor.csv", { type: "text/csv" });


// Автоматическое скачивание файла
const autoDownloadFile = (file) => {
  let link = document.createElement('a');
  link.download = file.name;

  link.href = URL.createObjectURL(file);
  link.click();
  URL.revokeObjectURL(link.href);
};


// Создаём файл для сохранения и автоматически скачиваем его
const createAndDownloadCSVFile = () => {
  const file = createCSVFile(WORK_DATA);
  autoDownloadFile(file);
};

// git add . && git commit -m "add footer" && git push origin master