/**
 *
 * @authors Your Name (you@example.org)
 * @date    2015-10-18 14:38:47
 * @version $Id$
 */
'use strict';
var React = require('react-native');

var API = require('../../network/api');
var api = require('../../api');
var Util = require('../../util/util');
var Loading = require('../loading');
var HTMLView = require('react-native-htmlview');
var Tabs = require('../../comps/tab');
var ScrollableTabView = require('react-native-scrollable-tab-view');

var {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
    ScrollView,
    } = React;

var resultsCache = {
    dataForOrder: [],
    nextPageNumberForQuery: {},
    totalForQuery: {},
    pageIndex:1,
};

var GoodsDetail = React.createClass({
    getInitialState: function() {
        return {
            good: null,
            page: 'detail'
        };
    },

    componentDidMount: function() {
        var data = this.props.data;
        this.setState({
          good: data,
          page: 'detail'
        });
        this._fetchGoods(data.goodId);
    },

    _fetchGoods:function (goodId) {

        var thiz = this;
        // Util.post(API.GOODSDETAIL,{'spec_id':spec_id},function (ret){
        //   if(ret.code==0){
        //     thiz.setState({
        //       good: ret.data,
        //     });
        //   }else{
        //     alert(ret.msg);
        //   }
        // });
        var options = {
            queries: {'inline-relation-depth': 1},
            filters: {}
        };
        console.log(api)
        api.goods.get(goodId, options, function (ret){
            if(ret.code == 200) {
                thiz.setState({
                  good: ret.data,
                });
            }
        });
    },

    addToCart: function(){
        console.log('add to cart')
    },

    renderTabContent: function(){
        //console.log(this.state.page)
        var good = this.state.good;
        var htmlContent = good.description || "";
        switch(this.state.page){
            case 'detail': 
                return  <View style={styles.contentView}>
                            <HTMLView value={htmlContent} style={styles.container}/>
                        </View>
            case 'comment': 
                return  <View style={styles.contentView}>
                            <Text>这里是评论内容</Text>
                        </View>
            case 'service': 
                return  <View style={styles.contentView}>
                            <Text>这里是服务内容</Text>
                        </View>
        }
    },

    render: function() {
        var good = this.state.good;
        var thiz = this;
        if(!good){
            return <Loading loadingtext='正在加载商品...'/>
        }
        var htmlContent = good.description || "";
        var TabView = thiz.renderTabContent();
        return (
            <View style={{flex: 1}}>
              <ScrollView style={{flex: .75, marginBottom:0}}>
                <View style={styles.container}>
                    <Image 
                        style={{width:Util.size.width,height:450}}
                        source={{uri: good.default_image}}
                        />
                    <Text style={[styles.textprimary,styles.paddingLeftRight,styles.marginTop10]}>商品名称：{good.name}</Text>
                    <Text style={[styles.textPrice,styles.paddingLeftRight,styles.marginTop10]}>天天价：{good.market_price}</Text>
                    <View style={[styles.line1,styles.marginTop10]}/>
                    <Text style={[styles.textsecond,styles.paddingLeftRight,styles.marginTop10]}>品牌：{good.brand_name}</Text>
                    <View style={[styles.line10,styles.marginTop10]}/>
                    <Tabs selected="detail" style={{backgroundColor:'white'}}
                          onSelect={function(el){thiz.setState({page: el.props.name});return {style:{color:'red'}}}}>
                        <View name="detail" style={thiz.state.page == 'detail' && styles.selected}>
                            <Text>     商品详情     </Text>
                        </View>
                        <View name="comment" style={thiz.state.page == 'comment' && styles.selected}>
                            <Text>     商品评论     </Text>
                        </View>
                        <View name="service" style={thiz.state.page == 'service' && styles.selected}>
                            <Text>     专享服务     </Text>
                        </View>
                    </Tabs>
                    <View>
                        {TabView}
                    </View>
                </View>
              </ScrollView>
              <View style={{flex: .25, borderTopWidth: 1, borderTopColor: '#dadce2', marginTop: 0}}>
                <TouchableHighlight
                  underlayColor='#ee7700'
                  style={{ justifyContent: 'center',alignItems: 'center',height: 50, backgroundColor:'#ee7700'}}
                  onPress={() => thiz.addToCart()}>
                  <Text style={{fontSize:18,color:'white'}}>添加到购物车</Text>
                </TouchableHighlight>
              </View>
            </View>
        );
    },
});
/**
<ScrollableTabView>
    <View tabLabel="React">
        <Text>React</Text>
    </View>
    <View tabLabel="Flow">
        <Text>React2</Text>
    </View>
    <View tabLabel="Jest">
        <Text>React3</Text>
    </View>
</ScrollableTabView>
**/

/**
<Tabs selected="detail" style={{backgroundColor:'white'}}
      onSelect={function(el){thiz.setState({page: el.props.name});return {style:{color:'red'}}}}>
    <View name="detail" style={thiz.state.page == 'detail' && styles.selected}>
        <Text>商品详情</Text>
    </View>
    <View name="comment" style={thiz.state.page == 'comment' && styles.selected}>
        <Text>商品评论</Text>
    </View>
    <View name="service" style={thiz.state.page == 'service' && styles.selected}>
        <Text>专享服务</Text>
    </View>
</Tabs>
**/


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f9f9f9',
    },
    thumb: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    line1:{
        height:1,
        backgroundColor:'#dadce2'
    },
    line10:{
        height:10,
        backgroundColor:'#ebeef1'
    },
    textprimary:{
        fontSize:18,
        color:'#4a4d52',
    },
    textsecond:{
        fontSize:18,
        color:'#929aa2',
    },
    textPrice:{
        fontSize:18,
        color:'#fb7e00',
    },
    marginTop10:{
        marginTop:15,
    },
    paddingLeftRight:{
        paddingLeft:10,
        paddingRight:10,
    },
    scrollSpinner: {
        marginVertical: 20,
    },
    rowSeparator: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: 10,
    },
    rowSeparatorHide: {
        opacity: 0.0,
    },
    line:{
        height:1,
        backgroundColor: '#eef0f3',
    },
    row: {
        flexDirection: 'row',
    },
    selected: {
        paddingBottom:10,
        paddingTop:10,
        borderBottomWidth: 2,
        borderBottomColor: '#D24161'
    },
    contentView: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:20,
        paddingTop:20,
    }
});

module.exports = GoodsDetail;