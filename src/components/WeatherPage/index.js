import React, { useEffect, useState } from 'react'
import "./index.css"

import { WiHumidity } from "react-icons/wi"
import { FiWind } from "react-icons/fi"

const WeatherPage = () => {
    const [weatherData, setWeatherData] = useState({})
    const [nightMode, setNightMode] = useState(false)
    const [searchCity, setSearchCity] = useState("")
    const [isError, setIsError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const onChangeSearch = (event) => {
        setSearchCity(event.target.value)
    }

    const searchWeather = async () => {
        let url 
        if (Number.isInteger(searchCity)) {
            url = `https://api.openweathermap.org/data/2.5/weather?zip=${searchCity}&appid=3f212c791d398487c065911cb224d2be`
        } else {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=3f212c791d398487c065911cb224d2be`
        }
        const response = await fetch(url)
        const data = await response.json()
        if (response.ok === false) {
            setIsError(true)
            setErrorMsg(data.message)
            return
        }
        setIsError(false)
        updateData(data)
        setSearchCity("")
    }

    const updateData = (data) => {
        const unixTime = data.dt
        const time = new Date((unixTime * 1000) + (data.timezone * 1000))
        const time2 = new Date(unixTime * 1000)
        let hours = time.getHours() - 6
        let minutes = time.getMinutes() - 30
        let timeMode = 'AM'
        if (hours < 0) {
            hours = 24 - Math.abs(hours)
        }
        if (minutes < 0) {
            minutes = 60 - Math.abs(minutes)
        }
        if (hours === 12) {
            timeMode = 'PM'
        }
        if (hours > 17 || hours < 6) {
            setNightMode(true)
        } else {
            setNightMode(false)
        }
        if (hours > 12) {
            hours = hours - 12
            if (hours < 10) {
                hours = '0' + hours
            }
            timeMode = 'PM'
        } else if (hours === 0) {
            hours = 12
        }

        if (minutes < 10) {
            minutes = '0' + minutes 
        }

        setWeatherData({
            name: data.name,
            feelsLike: Math.floor(data.main.feels_like),
            temperature: Math.floor(data.main.temp),
            humidity: data.main.humidity,
            main: data.weather[0].main,
            description: data.weather[0].description,
            windSpeed: Math.floor(data.wind.speed),
            day: time2.getDate(),
            month: time2.getMonth() + 1,
            year: time2.getFullYear(),
            hours: hours,
            minutes: minutes,
            timeMode: timeMode,
            icon: data.weather[0].icon
        })
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=3f212c791d398487c065911cb224d2be`
            const response = await fetch(url)
            const data = await response.json()
            if (response.ok === false) {
                setIsError(true)
                setErrorMsg(data.message)
                return
            }
            updateData(data)
            setIsError(false)
        })
    },[])

  return (
    <div className={nightMode ? "dark-home-page" : "light-home-page"}>
      <div className='search-cont'>
        <input className='search-elem' type='search' placeholder='Enter Location' onChange={onChangeSearch} value={searchCity} />
        <button className='search-btn' type='button' onClick={searchWeather} >Get Weather</button>
      </div>
      {isError ? <>
        <div className='error-cont'>
            <img className='error-img' src='https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png ' alt='not found' />
            <h1 className='name-text'>{errorMsg}</h1>
        </div>
      </> : <>
      <div>
        <h1 className='name-text'>{weatherData.name}</h1>
        <div className='date-cont'>
            <p className='date-text'>{weatherData.day}-{weatherData.month}-{weatherData.year}</p>
            <p className='date-text'>{weatherData.hours}:{weatherData.minutes} {weatherData.timeMode}</p>
        </div>
      </div>
      <div className='weather-cont'>
        <img className='weather-img' src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt='weather icon' />
        <h1 className='degree-text'><span className='degree-num'>{weatherData.temperature}</span>°C</h1>
        <div>
            <p className='weather-sub-text'>{weatherData.main}</p>
            <p className='date-text'>Feels like {weatherData.feelsLike}°c</p> 
        </div>
      </div>
      <div className='bottom-cont'>
        <div className='bottom-sub-cont'>
            <WiHumidity className='bottom-icon' />
            <div>
                <p className='bottom-text-1'>Humidity</p>
                <p className='bottom-text-2'>{weatherData.humidity}%</p>
            </div>
        </div>
        <div className='bottom-sub-cont'>
            <FiWind className='bottom-icon' />
            <div>
                <p className='bottom-text-1'>Wind Speed</p>
                <p className='bottom-text-2'>{weatherData.windSpeed}km/h</p>
            </div>
        </div>
      </div>
      <p className='description-text'>{weatherData.description}</p>
      </>}
    </div>
  )
}

export default WeatherPage
