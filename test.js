import promiseView from 'react-promise-view'
var promise=Promise.resolve("Success");
var V=(props)=><div>hello,{props.name}! we are {props.value}</div>
var PV=promiseView(promise)(V);

ReactDOM.render(<PV name="Jane" />, mountNode);


import promiseFactoryView from './promiseFactoryView'
var counter=1;
var pf=()=> Promise.resolve(counter++);
var V2=({abc,ns,refresh})=><ul>
  <li>hello,{abc}</li>
  <li onClick={refresh} style={{cursor:"pointer"}}>click herer refresh by props function</li>
  <li onClick={()=>PubSub.publish(ns,"refresh")} style={{cursor:"pointer"}}>click here refresh by pubsub</li>
</ul>
var PFV=promiseFactoryView(pf,{value:"abc"})(V2);
ReactDOM.render(<PFV name="Jane" />, mountNode);
