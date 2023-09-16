var place = "kolkata";
var idk = 0;
var url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${place}?unitGroup=metric&key=GU7E7GYACE72A64H77W6KRGS7&contentType=json`;

var dayIndex = {
	0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thurday", 5: "Friday", 6: "Saturday"
}

var dayIndexShort = {
	0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat"
}

var monthIndex = {
	0: "January", 1: "Febuary", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July", 7: "Augest", 8: "September", 9: "October", 10: "November", 11: "December"
}

navDate = () => {
	let d = new Date();
	let day = dayIndex[d.getDay()];
	let date = d.getDate();
	let month = monthIndex[d.getMonth()];

	document.getElementById('navDate').innerText = `${day}, ${date} ${month}`;
}

mainCardDate = () => {
	fetch(`${url}`).then(response => {
		return response.json();
	}).then(data => {
		let d = new Date();
		let h = d.getHours();
		let temp = data.days[0].hours[0].temp;
		let place = data.resolvedAddress.split(',')[0];
		let m = d.getMinutes();
		if (String(m).length == 1) m = '0' + String(m)
		if (String(h).length == 1) h = '0' + String(h)
		document.getElementById('mainCardPlace').innerText = `${place}`;
		document.getElementById('mainCardDate').innerText = `${h}:${m}`;
		document.getElementById('mainCardTemp').innerText = `${Math.floor(temp)}°`;
		document.getElementById('main-icon').src = `./assets/${data.currentConditions.icon}.svg`
	})

}

sunInfoCard = () => {
	fetch(`${url}`).then(response => {
		return response.json();
	}).then(data => {
		let sunrise = data.currentConditions.sunrise.split(":");
		sunrise = sunrise.slice(0, 2)
		let sunset = data.currentConditions.sunset.split(":");
		sunset = sunset.slice(0, 2)

		document.getElementById('sunrise-time').innerText = `${sunrise[0]}:${sunrise[1]}`;
		document.getElementById('sunset-time').innerText = `${sunset[0]}:${sunset[1]}`;
	})

}

hourRows = (b) => {
	fetch(`${url}`).then(response => {
		return response.json();
	}).then(data => {
		let d = new Date();

		let hours = data.days[0].hours;

		let hourlyRow = document.getElementById('hourly-row')

		let h = Number(data.currentConditions.datetime.split(":")[0]);

		if (b == true) {


			tzoff = d.getTimezoneOffset() / 60 + Number(data.tzoffset)
			console.log(tzoff)
			d.setTime(d.getTime() + (tzoff * 60 * 60 * 1000))

			let h = d.getHours();
			let m = d.getMinutes();

			if (String(m).length == 1) m = '0' + String(m)
			if (String(h).length == 1) h = '0' + String(h)
			document.getElementById('mainCardDate').innerText = `${h}:${m}`;

			let day = dayIndex[d.getDay()];
			let date = d.getDate();
			let month = monthIndex[d.getMonth()];

			document.getElementById('navDate').innerText = `${day}, ${date} ${month}`;
		}

		hourlyRow.innerHTML = '';

		for (let i = h; i < hours.length; i++) {
			const el = hours[i];
			hourlyRow.innerHTML = hourlyRow.innerHTML + `<div class="hour-row">
			<div class="hr-time">${el.datetime.split(":").slice(0, 2).join(":")}</div>
			<div class="hr-icon"><img src="./assets/${el.icon}.svg" alt=""></div>
			<div class="hr-temp">${Math.floor(el.temp)}°</div>
			<div class="hr-precip"><img src="./assets/humidity.svg" alt=""><span>${el.precipprob}%</span></div>
		</div>`
		}
	})

}

miscInfo = () => {
	fetch(`${url}`).then(response => {
		return response.json();
	}).then(data => {
		let info = data.currentConditions;

		document.getElementById('feels-like').innerText = `${info.feelslike}°`;
		document.getElementById('wind-speed').innerText = `${info.windspeed}km/h`;
		document.getElementById('pressure').innerText = `${Math.round((info.pressure / 1013) * 100) / 100}atm`;
		document.getElementById('uv-index-info').innerText = `${info.uvindex}`;
		if (info.uvindex != 0) {
			document.getElementById('uv-icon').src = `./assets/uv-index-${info.uvindex}.svg`;
		}
		else {
			document.getElementById('uv-icon').src = "./assets/clear-night.svg";
		}
	})

}

dailyRows = () => {
	fetch(`${url}`).then(response => {
		return response.json();
	}).then(data => {
		let days = data.days;

		let dailyCol = document.getElementById('daily-column')

		dailyCol.innerHTML = '';

		for (let i = 0; i < days.length; i++) {
			const el = days[i];
			let dw = el.datetime.split('-')[2]
			let dm = el.datetime.split('-')[1]

			let cond = el.conditions;
			if (cond.length > 13) {
				cond = cond.slice(0, 13) + '...';
			}

			let ddString = "";
			const hours = el.hours;

			for (let j = 0; j < hours.length; j++) {
				const eld = hours[j];
				ddString = ddString + `<div class="dd-col">
					<div class="dd-temp">${Math.floor(eld.temp)}°</div>
					<div class="dd-icon"><img src="./assets/${eld.icon}.svg" alt=""></div>
					<div class="dd-time">${eld.datetime.split(":").slice(0, 2).join(":")}</div>
				</div>`
			}


			d = new Date(0);
			d.setSeconds(el.datetimeEpoch);
			dailyCol.innerHTML = dailyCol.innerHTML + `<div onclick="ddDown(${i})" class="daily-row" id="daily-${i}">
			<div class="dr-date">
				<span>
					${dw}/${dm}
				</span>
			</div>
			<div class="dr-day">
				<span>
					${(i == 0) ? "Today" : dayIndexShort[d.getDay()]}
				</span>
			</div>
			<div class="dr-icon"><img style="width:30px;" src="assets/${el.icon}.svg" alt=""></div>
			<div class="dr-desc">
				<span>
					${cond}
				</span>
			</div>
			<div class="dr-tmin">${Math.floor(el.tempmax)}°</div>
			<div class="dr-tmax">${Math.floor(el.tempmin)}°</div>
		</div>

		<div class="daily-dropdown" id="dd-${i}">
			${ddString}
		</div>

		`
		}

	})

}

ddDown = (i) => {
	st = document.getElementById(`dd-${i}`).style;
	if (idk == 0) {
		st.display = 'flex';
		idk = idk + 1;
	}
	else {
		if (st.display == 'flex') {
			st.display = 'none';
		}
		else {
			st.display = 'flex';
		}
	}
}

changePlace = () => {
	let foo = prompt('enter the new location');
	if (foo != null) {
		place = foo;
		url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${place}?unitGroup=metric&key=GU7E7GYACE72A64H77W6KRGS7&contentType=json`
		boxBox(true);
	}
}

boxBox = (t) => {
	navDate();
	mainCardDate();
	hourRows(t);
	sunInfoCard();
	dailyRows();
	miscInfo();
}

boxBox(false, true);
