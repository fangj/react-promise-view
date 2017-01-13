# react-promise-view
inject promise result as props to react component


### How to use

```
import promiseView from 'react-promise-view'
var promise=Promise.resolve("Success");
var V=(props)=><div>hello,{props.name}! we are {props.value}</div>
var PV=promiseView(promise)(V);

ReactDOM.render(<PV name="Jack" />, mountNode);
```