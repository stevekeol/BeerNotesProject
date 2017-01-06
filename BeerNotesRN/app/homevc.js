'use strict'
import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  View,
  ListView,
  Image,
  Text,
  Platform,
  Alert,
  Linking,
  NativeAppEventEmitter,
  DeviceEventEmitter
} from 'react-native';

import {
  isFirstTime,
  isRolledBack,
  packageVersion,
  currentVersion,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess,
} from 'react-native-update';

import NavigationBar from 'react-native-navbar';
import SqlHelper from './db/sqlhelper';

import _updateConfig from '../update.json';
const {appKey} = _updateConfig[Platform.OS];

var listData= [
  {
  text:'我的配方',
  img:require('../resource/fname_normal.png')
  },
  {
  text:'酒精度数',
  img:require('../resource/alcohol_degree_normal.png')
  },
  {
  text:'二氧化碳',
  img:require('../resource/co2_normal.png')
  },
  {
    text:'相关资料',
    img:require('../resource/related_normal.png')
  },
  {
  text:'消息',
  img:require('../resource/message_normal.png')
  },
  {
  text:'更多',
  img:require('../resource/more_normal.png')
  }
];
var ds = null;
var sqlHelper;
var subscription;
export default class HomeVC extends React.Component {
    // 进入配方
    _goFormulaVC(){
      this.props.nav.push({
        id:'formulavc',
        name:'formulavc'
      })
    }
    // 进入关于
    _goAlcoholDegreeVC(){
      this.props.nav.push({
        id:'alcoholdegreevc',
        name:'alcoholdegreevc'
      })
    }
    _goCo2VC(){
      this.props.nav.push({
        id:'co2vc',
        name:'co2vc'
      })
    }
    _goRelated(){
      this.props.nav.push({
        id:'relatedvc',
        name:'relatedvc'
      })
    }
    _goMessageVC(){
      this.props.nav.push({
        id:'messagevc',
        name:'messagevc'
      })
    }
    //进入更多
    _goMorevc(){
      this.props.nav.push({
        id:'morevc',
        name:'morevc'
      })
    }
    _pressRow(rowID){
      if(rowID == 0 ){
        this._goFormulaVC();
      }else if(rowID == 1){
        this._goAlcoholDegreeVC();
      }else if(rowID == 2){
        this._goCo2VC();
      }else if(rowID == 3){
        this._goRelated();
      }else if(rowID == 4){
        this._goMessageVC();
      }else if(rowID == 5){
        this._goMorevc();
      }
    }
    _renderRow(rowData, sectionID, rowID){
      return(
        <TouchableOpacity onPress={()=>this._pressRow(rowID)}>
        <View >
          <View style={styles.row}>
            <Image style={styles.thumb} source={rowData.img} />
            <Text style={styles.text}>
              {rowData.text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      )
    }

    _initUpdate(){
      // console.log("currentVersion:",currentVersion,"isFirstTime:",isFirstTime,"isRolledBack:",isRolledBack)
      if (isFirstTime) {
         Alert.alert('提示', '这是当前版本第一次启动,是否要模拟启动失败?失败将回滚到上一版本', [
           {text: '是', onPress: ()=>{throw new Error('模拟启动失败,请重启应用')}},
           {text: '否', onPress: ()=>{markSuccess()}},
         ]);
       } else if (isRolledBack) {
         Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
       }
    }

    constructor(props){
      super(props);
      this._renderRow = this._renderRow.bind(this);
      ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows(listData),
      };
      // console.log("appKey:",appKey);
      this._initUpdate();
      sqlHelper = new SqlHelper();
    }
    componentDidMount() {
      DeviceEventEmitter.addListener('saveMessage', function(e: Event) {
         // handle event.
         console.log('bn saveMessage:',e)
         sqlHelper.insertMessageDB(e.title,e.text);
       });
    }
    componentWillUnmount(){

    }

    render(){
      var titleConfig = {
        title: '家酿笔记',
        tintColor:'#ffffff'
      };
      return(
        <View style={{flex: 1}}>
          <NavigationBar
            tintColor={'#34495e'}
            title={titleConfig} />
          <ListView
          contentContainerStyle={styles.list}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}/>
        </View >
      );
    }
  }

  var styles = StyleSheet.create({
    list: {
      marginTop:5,
      justifyContent: 'space-around',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    },
    row: {
      justifyContent: 'center',
      padding: 5,
      margin: 3,
      width: 85,
      height: 85,
      backgroundColor: '#F6F6F6',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#CCC'
    },
    thumb: {
      width: 45,
      height: 45
    },
    text: {
      flex: 1,
      marginTop: 5,
      fontWeight: 'bold'
    },
  });
