//promiseView
//promiseView(promise)(View)
//promiseView(promise,{value:"value",reason:"reason"})(View) 
//


import React from 'react';
var mc=require('make-cancelable');
const defaultPropNames={value:"value",reason:"reason"};
class PromiseViewWrapper extends React.Component {
  static propTypes = {
    ___promise: React.PropTypes.func, //promise
    ___propNames:React.PropTypes.object,
    InjectedView:React.PropTypes.func,
  };
  static defaultProps = {
    ___promise:Promise.resolve,
    ___propNames:defaultPropNames,
  InjectedView:()=>null
  };
  constructor(props) {
    super(props);
    this.state={};
    this.doPromise=this.doPromise.bind(this);
  }

  doPromise(props){
    this.promise=mc(props.___promise);//使用cancelable promise以避免数据到来时组件已经unmount
    this.promise.then(value=>this.setState({value}))
      .catch(reason=>{
        !reason.isCanceled&&this.setState({reason}) //如果被cancel可能是组件unmount,不能再setState
    });
  }

  componentDidMount() {
    this.doPromise(this.props);//执行promise
  }

  componentWillUnmount() {
    this.promise && this.promise.cancel(); //视图消失时取消promise
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.promise!=nextProps.promise){
      doPromise(nextProps);
    }
  }

  render() {
    const {___promise,InjectedView,___propNames,...others}=this.props;
    const {value,reason}=this.state;
    const propNames=Object.assign({},defaultPropNames,___propNames);
    if(typeof value===undefined && typeof reason===undefined){
      return null;
    }
    if(reason===undefined){
      others[propNames.value]=value;
    }else{
      others[propNames.reason]=reason;
    }
    return (<InjectedView {...others}/>);
  }
}

const _promiseView=(promise,InjectedView,propNames)=>{
  return (props)=><PromiseViewWrapper ___promise={promise} ___propNames={propNames} InjectedView={InjectedView} {...props}/>
}

module.exports=function(promise,propNames={}){
  return (InjectedView)=>_promiseView(promise,InjectedView,propNames);
};