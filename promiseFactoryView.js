//promiseView
//promiseView(promiseFactory)(View)
//promiseView(promiseFactory,{value:"value",reason:"reason"})(View) 
//
//给注入的View添加属性refresh,以执行新的promise
//接受Pubsub消息 (ns,"refresh")

import React from 'react';
var mc=require('make-cancelable');
const defaultPropNames={value:"value",reason:"reason"};
var PubSub=require('pubsub-js');

class PromiseFactoryViewWrapper extends React.Component {
  static propTypes = {
    ___promiseFactory: React.PropTypes.func, //promise
    ___propNames:React.PropTypes.object,
    InjectedView:React.PropTypes.func,
    ns:React.PropTypes.string, //名字空间
  };
  static defaultProps = {
    ___promiseFactory:()=>Promise.resolve("PromiseFactoryViewWrapper need promiseFactory which return a promise"),
    ___propNames:defaultPropNames,
    InjectedView:()=>null,
    ns:"PromiseViewFactory"
  };
  constructor(props) {
    super(props);
    this.state={};
    this.doPromise=this.doPromise.bind(this);
    this.handleMsg=this.handleMsg.bind(this);
    this.refresh=this.refresh.bind(this);
  }

  doPromise(props){
    this.promise=mc(props.___promiseFactory());//使用cancelable promise以避免数据到来时组件已经unmount
    this.promise.then(value=>{
      this.setState({value})
  })
      .catch(reason=>{
        !reason.isCanceled&&this.setState({reason}) //如果被cancel可能是组件unmount,不能再setState
    });
  }

  refresh(){
    this.doPromise(this.props);
  }

  handleMsg(ns,msg){
    if(msg==="refresh"){
      this.refresh();
    }
  }

  componentDidMount() {
    this.doPromise(this.props);//执行promise
    this.token=PubSub.subscribe(this.props.ns,this.handleMsg);
  }

  componentWillUnmount() {
    this.promise && this.promise.cancel(); //视图消失时取消promise
    PubSub.unsubscribe(this.token);
  }


  componentWillReceiveProps(nextProps) {
    if(this.props.promise!=nextProps.promise){
        doPromise(nextProps);
    }
  }

  render() {
    const {___promiseFactory,InjectedView,___propNames,...others}=this.props;
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
    others.refresh=this.refresh;//注入刷新函数
    return (<InjectedView {...others}/>);
  }
}

const _promiseFactoryView=(promiseFactory,InjectedView,propNames)=>{
  return (props)=><PromiseFactoryViewWrapper ___promiseFactory={promiseFactory} ___propNames={propNames} InjectedView={InjectedView} {...props}/>
}

module.exports=function(promiseFactory,propNames={}){
  return (InjectedView)=>_promiseFactoryView(promiseFactory,InjectedView,propNames);
};