import React from 'react';
import { createRoot } from 'react-dom/client';
import {nextFib } from './fib';
import './index.css';


const main: HTMLElement | null = document.getElementById('main');
if (main === null) {
  console.log('Uh oh! no "main" element!');
} else {
  const root = createRoot(main);
  const params: URLSearchParams = new URLSearchParams(window.location.search);
  const name: string | null = params.get('firstName');
  const ageVal: string | null = params.get('age');
  
  if (name === null || ageVal === null) {
    root.render(<form className='form' action="/">
    <p>Hi there! Please enter the following information:</p>
    <p>Your first name: <input type="text" name="firstName"></input></p>
    <p>Your age: <input type="number" name="age" min="0"></input></p>
    <input type="submit" value="Submit"></input>
    </form>
    );
  }
  else {
    const age = parseInt(ageVal);
    if (isNaN(age) || age < 0) {
      root.render(<p>The parameter "age" is not a nonnegative integer.</p>);
    }
    else {
      const fibNumber: number = nextFib(age);
      if (fibNumber === age) {
        root.render(
          <div>
            <p>Hi, {name}! Your age ({age})is a Fibonacci number!</p>
            <p><a href = "http://localhost:8080/">Start Over</a></p>
          </div>);  
      }
      else {
        root.render(
          <div>
            <p>Hi, {name}! Your age ({age}) will be a Fibonacci number in {fibNumber - age} years</p>
            <p><a href = "http://localhost:8080/">Start Over</a></p>            
          </div>);
      }
    }
  }
}
