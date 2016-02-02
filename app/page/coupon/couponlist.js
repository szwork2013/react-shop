/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-18 14:38:47
 * @version $Id$
 */
'use strict';
var React = require('react-native');
var Global = require('../../util/global');
var API = require('../../network/api');
var Util = require('../../util/util');
var Loading = require('../loading');

var {
  	StyleSheet,
  	View,
    Text,
    ListView,
} = React;

var Market = React.createClass({
  getInitialState: function() {
    return {
      dataSource:new ListView.DataSource({rowHasChanged:(row1,row2) =>row1!==row2}),
      loaded:false,
    };
  },

  componentDidMount: function() {
    this._getCouponList();
  },

  _getCouponList:function(){
    var thiz = this;
    var thizDataSource = thiz.state.dataSource;
    var mocData = [{}, {}]
    thiz.setState({
        dataSource: thizDataSource.cloneWithRows(mocData),
        loaded:true,
    });

    // Util.post(API.COUPONLIST,Global.user,
    //   function (ret){
    //     if(ret.code==0&&ret.data.length>0){
    //       thiz.setState({
    //           dataSource: thizDataSource.cloneWithRows(ret.data),
    //           loaded:true,
    //       });
    //     }else{
    //       alert("暂无红包");
    //       thiz.setState({loaded:true,});
    //     }
    //   });
  },

  _renderListItem:function(rowData){
    return (
      <View style={{padding:15,backgroundColor:'white',marginBottom:10}}>
        <View style={styles.stamp, styles.stamp01, {height: 120, flexDirection:'row', backgroundColor:'#D24161',overflow:'hidden'}}>
            <View style={styles.par, {flex: 2, borderRightWidth: 1, borderRightColor: 'rgb(255,255,255,.8)', borderStyle: 'dashed', padding: 10}}>
              <Text style={styles.sup, {color:'#fff', fontSize: 14,marginTop: 5}}>长沙景和食品有限公司</Text>
              <Text style={styles.sign, {fontSize:20, color:'#fff', marginTop: 10}}>￥
                <Text style={styles.amount, {fontSize:35, color:'#fff',fontWeight: 'bold'}}>50.00</Text>
                <Text style={styles.sub, {fontSize:14, color:'#fff'}}>  优惠券</Text>
              </Text>
              <Text style={styles.desc, {fontSize:14, color:'#fff', marginTop: 10}}>订单满100.00元</Text>
            </View>
            <View style={styles.copy, {flex: 1,padding:10}}>
              <Text style={{fontSize:20, color:'#fff', marginTop: 15,fontWeight: '300'}}>副券</Text>
              <Text style={styles.duedate, {fontSize:14, color:'#fff', marginTop: 15,fontWeight: 'bold'}}>过期时间: 2015-08-13</Text>
            </View>
            <View style={styles.ibg, {
                position: 'absolute', left: 20, top: 45, height: 190, width: 390, 
                backgroundColor: 'rgba(255, 255, 255, .15)', transform: [{rotate: '-30deg'}]
              }}></View>
            </View>
      </View>
      );
  },

  render: function() {
    if(!this.state.loaded){
        return <Loading loadingtext='正在加载卡券列表数据...'/>
    };
    return (
     <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderListItem}/>
     </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stamp: {
    flex: 1,
    height: 440,
    paddingVertical: 0,
    paddingHorizontal: 10,
    marginBottom: 50,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#F39B00'
  },
  // .stamp:before {
  //   content: '';
  //   position: absolute;
  //   top:0;
  //   bottom:0;
  //   left:10px;
  //   right:10px;
  //   z-index: -1;
  // }
  // ibg: {
  //   position: 'absolute',
  //   left: 20,
  //   top: 45,
  //   height: 190,
  //   width: 390,
  //   backgroundColor: 'rgba(255, 255, 255, .15)',
  //   transform: [{rotate: '-30deg'}]
  // },
  par: {
    paddingVertical: 16,
    paddingHorizontal: 15,
    width: 220,
    borderStyle: 'dashed',
    borderRightWidth: 2,
    borderRightColor: 'rgba(255, 255, 255, .3)'
  },
  // sup: {
  //   color:'#fff',
  //   fontSize: 16,
  //   lineHeight: 21
  // },
  // amount: {
  //   fontSize: 40,
  //   color: '#fff',
  //   marginRight: 5,
  //   lineHeight: 65
  // },
  // sign: {
  //   fontSize: 24
  // },
  // sub: {
  //   position: 'relative',
  //   top:-5,
  //   color: 'rgba(255, 255, 255, .8)'
  // },
  // copy: {
  //   paddingVertical: 21,
  //   paddingHorizontal: 14,
  //   width:100,
  //   fontSize: 30,
  //   color: 'rgb(255,255,255)',
  //   textAlign: 'center'
  // },
  // duedate: {
  //   fontSize: 16,
  //   marginTop: 15
  // }
});

module.exports = Market;