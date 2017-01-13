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


customize the injected props name

by default, when promise is fulfill, "value" prop is injected to the component
when promise is rejected,"reason" prop is injected to the component

if you do not want to use "value" or "reason",you can customize it.

```
var PV=promiseView(promise)(V,{value:"data",reason:"error"});

"data" and "error" props will inject to V
```