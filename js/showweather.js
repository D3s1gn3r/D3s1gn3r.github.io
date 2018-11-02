
// Функция создающая елемент canvas в html
function createCanvas(){
		var canvas = document.createElement('canvas');
		canvas.id = 'canvas';
		var container = document.getElementById('graph_container');
		container.appendChild(canvas);
}

// Функция строящая график погоды на 5 дней
function graph(array,name){
		/*
			Функция проверяет наличия елемента canvas в html
			и создаёт его, если его не существет. Дальше функция
			берёт текущую дату и составляет массив из 5-ти последовательных
			дат которые будут точками построенного графика. Дальше эти
			элементы отправляются в график вместе с значениями температуры
			и график отображается на странице.
		*/
		var canvas = document.getElementById("canvas")
		if (canvas == null){
			createCanvas();
		}
		var date = new Date();
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        
        var arr = [];
        for (var i = 0; i<5; i++){
            var today = day + "." + month + "." + year;
            day++;
            arr.push(today);
        }
    	new Chart(document.getElementById("canvas"), {
	  	type: 'line',
	  	data: {
		    labels: [arr[0],arr[1],arr[2],arr[3],arr[4]],
		    datasets: [{ 
        		data: [array[0],array[1],array[2],array[3],array[4]],
		        label: name,
		        borderColor: "#3e95cd",
		        fill: false
		      }]
  		},
 		options: {
    	title: {
      	display: true,
      	text: 'График температуры ближайшие 5 дней'
    	}
  		}
	});
}

//Функция выполняющая выборку температуры на 5 дней
function graphelements(elements){
		/*
			Функция создаёт массив в который берёт каждую 8-температуру
			(файл присылает 40 объектов температур, температура за каждые 3 часа
			то есть берётся температура в одно и то же время каждого дня)
			в объекте файла JSON присланного от сервера погоды, дальше отправляет
			массив в функцию для построения графика относительно этих значений. 
		*/
        var array = [];
        var m = 0;
        var name = elements.city.name;
        for (var i = 0; i<5; i++){
            array.push(Math.round(elements.list[m].main.temp-273));
            m = m + 8;    
         }
         graph(array,name); 
	  }

// Функция которая выводит информацию о погоде
function showinfo(info){
	/*
		Берётся объект полученый через API и параграфы из html
		которым присваиваються значения из объекта
	*/
	var information = JSON.parse(info);
	
	var name = document.getElementById("name");
	var weather = document.getElementById("weather");
	var temperature = document.getElementById("temperature");
	var humidity = document.getElementById("humidity");
	var pressure = document.getElementById("pressure");
	var img = document.getElementById("img");

	
	name.innerHTML = "Название : " + "<b>" + information.city.name + "</b>";
	weather.innerHTML = "Погода : " + "<b>"+ information.list[0].weather[0].main + "</b>";
	icon = information.list[0].weather[0].icon
	img.src = "https://openweathermap.org/img/w/"+icon+".png";
	temperature.innerHTML = "Температура : " + "<b>" + Math.round(information.list[0].main.temp-273) + " °C" + "</b>";
	humidity.innerHTML = "Влажность : " + "<b>" + information.list[0].main.humidity + " %" + "</b>";
	pressure.innerHTML = "Давление : " + "<b>" + information.list[0].main.pressure + " мм.рт.ст" + "</b>";
}

// Функция обращения через API к openweathermap 
function info(id){
	/*
		Берём свой appi и id нужного элемента и запрашиваем его
		через API, так же отправляем этот объект в следующую функцию
	*/
	var appid = "892c92bb0c25f4701d69971cf5f0aa0f";
  	var url = "http://api.openweathermap.org/data/2.5/forecast?id="+id+"&appid="+appid


	var xhr = new XMLHttpRequest();

	// 2. Конфигурируем его: GET-запрос на URL 'phones.json'
	xhr.open('GET', url, false);

	// 3. Отсылаем запрос
	xhr.send();

	// 4. Если код ответа сервера не 200, то это ошибка
	if (xhr.status != 200) {
	  // обработать ошибку
	  alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
	} else {
      	showinfo(xhr.responseText);
      	var logs = JSON.parse(xhr.responseText)
      	graphelements(logs);
      	
	}
}

// Функция которая выводит города пользователю
function writer(city, number) {
	/*
		Функция обращается к div в html и создаёт в нём
		заголовки, значения которых меняется на название
		городов определённой странны и каждому присваиваться
		собственный айди
	*/
	var element = document.getElementById('city');
	var names = document.createElement('h1');
	names.id = number;
	names.innerHTML = city;
	element.appendChild(names);
	names.onclick = function() {
		info(names.id);
		};
}

// Функция стирающая города, при смене страны
function cleaner(elements, length) {
	for(var i=1; i<length; i++){
		elements[1].remove();

	}
}	

// Функция которая обрабатывает действия пользователя
function showProvinces(){
	/*
		Функция срабатывает при изменении значения в select
		тогда она считывает это значение и проверяет список
		городов на это значение и передаёт нужные в следующие
		функции.
	*/
	var selectBox = document.getElementById("box");
	var userInput = selectBox.options[selectBox.selectedIndex].value;
	var length = cities.length;
	var elements = document.getElementsByTagName("h1");
	var amount = elements.length;
	if (amount>1){
			cleaner(elements, amount);
		}
	if (userInput == "UA"){
		for (var i=0; i<length; i++){
			if (cities[i].country == "UA"){
				writer(cities[i].name, cities[i].id);		
			}
		}
	}
	else if(userInput == "RU") {
		for (var i=0; i<length; i++){
			if (cities[i].country == "RU"){
				writer(cities[i].name, cities[i].id);		
			}
		}	
	}
}