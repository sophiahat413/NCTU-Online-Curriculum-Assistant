import React from 'react'
import IconButton from 'material-ui/IconButton';
import ActionGrade from 'material-ui/svg-icons/image/assistant';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Popover from 'react-simple-popover';
import 'animate.css'
import Toggle from 'material-ui/Toggle';
import ReactHover from 'react-hover';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ScrollToTopBtn from '../../../Components/ScrollToTopBtn';
import axios from 'axios'
import scrollToComponent from 'react-scroll-to-component'
import CreditOverview from './CreditOverview';
import App from './Trello/List'
import FlatButton from 'material-ui/FlatButton';
import DialogWaring from './Trello/warning'
import { ToastContainer, toast } from 'react-toastify';
import './Graduation.css'
import Snow from 'react-snow-effect'

const customContentStyle = {
    width: '100%',
    height:'80vh',
    maxWidth: 'none',
    maxHeight: 'none',
};

const bodyStyle = {
    fontFamily: 'Noto Sans CJK TC',
    padding:'0'
};
const titleStyle = {
    fontFamily: 'Noto Sans CJK TC',
    color:'#565656'
};


const optionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 10,
    shiftY: -30
};

const styles = {
    toggle: {
        marginBottom: 0,
        maxWidth: 200,
        width:'400px',
        float:'left',
        margin:'15px 10px 0 20px',
    },
    button: {
        margin:'9px 10px 0 0px',
        width:'150px',
        float:'left',
        zIndex:'-1'
    },
    button1: {
        margin:'9px 10px 0 0px',
        width:'200px',
        float:'left',
        zIndex:'1000'
    },
    buttonDia: {
        margin:'0 10px 0 10px',
        width:'100px'
    },
    buttonEn: {
        margin:'9px 10px 0 0px',
        width:'250px',
        float:'left',
        zIndex:'-1'
    },
    labelStyle: {
        fontFamily: 'Noto Sans CJK TC',
        color: '#7B7B7B'
    },
    medium:{
        color: '#7B7B7B',
        float:'right'
    },
    pop:{
        width:'auto',
        height: 'auto'
    }
};

class GradCreditCheck extends React.Component {


    state={
        isMod:false,
        isToggle:false,
        opendialogprint: false,
        openforRevise:false,
        graduationCheck:false,
        graduationCheckEnglishTest:"",
        graduationItems:[],
        items:[],
        totalitems:[],
        courseCategoryArray:[],
        Result:[],
        ReviseResult:this.props.reviseresult,
        print_courseCategoryArray:[],
        post:false
    };
    componentWillMount(){
        this.setState({
            items:this.props.items,
            graduationItems:this.props.revise,
            Result:this.props.result,
            ReviseResult:this.props.reviseresult,
            totalitems:this.props.reviseresult,
            print_courseCategoryArray:this.props.courseCategoryArray,
        });
        let _this=this;

        if(this.props.assistant) {
            axios.get('/assistants/graduate/check', {
                params: {
                    student_id: this.props.studentProfile.student_id,
                }
            }).then(studentData => {
                _this.setState({
                    graduationCheck: studentData.data.check.state
                })
            }).catch(err => {
                console.log(err);
            });
            axios.get('/assistants/graduate/english', {
                params: {
                    student_id: this.props.studentProfile.student_id,
                }
            }).then(studentData => {
                _this.setState({
                    graduationCheckEnglishTest: studentData.data.check.state
                })
            }).catch(err => {
                console.log(err);
            });

        }else{
            axios.get('/students/graduate/check').then(studentData => {
                _this.setState({
                    graduationCheck: studentData.data.check.state
                })
            }).catch(err => {
                console.log(err);
            });
            axios.get('/students/graduate/english').then(studentData => {
                _this.setState({
                    graduationCheckEnglishTest: studentData.data.check.state
                })
            }).catch(err => {
                console.log(err);
            });
        }

    }

    notify = () => {
        toast(<div style={{fontFamily: 'Noto Sans CJK TC'}}>已幫您自動排序，欲知排序依據請點選自動排序旁的星號標誌，此為系統自動排序僅以參考為主，<font color={"#ae2528"}>若已經編輯過課程此為顯示手動編輯後的課程。</font></div>, {
            position: toast.POSITION.TOP_RIGHT,
            className: "dark-toast",
        });
    }
    handleOpenforRevise = () => {
        this.setState({openforRevise: true});
    };

    handleCloseforRevise = () => {
        this.setState({openforRevise: false});
    };
    clearManual = () => {
        axios.post('/students/graduate/reorder/reset', {
                Danny:"Danny"
        })
            .then(res => {
            })
            .catch(err => {
                window.location.replace("/logout ");
                console.log(err)
            });
        window.location.replace("/students/Head ");

    };
    async ReviseClick () {
        this.setState({
            post:true
        });
        // if(this.props.assistant){
        //     window.location.reload();
        // }else{
        // }
    }
    //For updating as props changes!!!
    componentDidUpdate(prevProps, prevState){
        if( prevProps.items !== this.props.items ||
            prevProps.revise !== this.props.revise ||
            prevProps.result !== this.props.result ) {
            this.setState({
                items:this.props.items,
                graduationItems:this.props.revise,
                totalitems:this.props.result
            });
        }
    }
    scrollTotop(){
        scrollToComponent(this.refs.my);
    }
    printGradTable(fileName) {
        let original = document.title;
        if (fileName !== null)
            document.title = fileName;
        window.print();
        document.title = original;
        this.setState({opendialogprint: true});
        return true;
    }
    handleToggle(){
        this.setState({isToggle:!this.state.isToggle});
        if(this.state.isToggle){
            this.setState({
                totalitems:this.state.ReviseResult,
            });
            this.notify()
        }
        else{
            this.setState({
                totalitems:this.state.Result
            });
        }
    }

    handleClose(e) {
        this.setState({open: false});
    }

    handleClickview(e) {
        this.setState({
            open: !this.state.open,
            isToggle:this.state.isToggle
        });
    }

    handleAssistantPost(){
        axios.post(' /assistants/graduate/check', {
            student_id: this.props.studentProfile.student_id,
        }).then(res => {
            console.log(res);
            if(res.check)
                this.setState({
                    graduationCheck:true,
                });
        }).catch(err => {
            window.location.replace("/logout ");
            console.log(err)
        });
    }

    componentDidMount(){

    }

    render(){
        const actions = [
        <FlatButton
            label="清除手動排序"
            labelStyle={styles.labelStyle}
            onClick={this.clearManual}
        />,
        <FlatButton
            label="取消"
            labelStyle={styles.labelStyle}
            onClick={this.handleCloseforRevise}
        />,
        <DialogWaring onClick={()=>this.ReviseClick()}
        />,
    ];
        return(
            <div className="font_adjust">
                <Snow/>
                <div className="fixed" onClick={()=>this.scrollTotop()}>
                    <ScrollToTopBtn/>
                </div>
                <div className="Grad-title-adjust" ref="my">
                    <div className="Grad-title-text">
                        {this.props.assistant?
                            <div>
                                <div id="lessons-little-title-grad">資工系{this.props.studentProfile.program}組 - {this.props.studentProfile.student_id}{this.props.studentProfile.sname}</div>
                            </div>
                            :
                            <div>
                                <div id="lessons-title">畢業預審</div>
                                <div id="lessons-little-title-grad">-資工系{this.props.studentProfile.program}組</div>
                            </div>
                        }

                    </div>

                    <div className="tip">
                        <div className="green"> </div><div className="text">已通過</div>
                        <div className="red"> </div><div  className="text">未通過</div>
                        <div className="gray"> </div><div  className="text">未修課</div>
                        <div className="yellow"> </div><div  className="text">未抵免課程</div>
                        <div className="purple"> </div><div  className="text">免修或抵免課程</div>
                        <div className="blue"> </div><div  className="text">當期課程</div>
                        <div>
                            <ReactHover options={optionsCursorTrueWithMargin}>
                                <ReactHover.Trigger type='trigger'>
                                    <MuiThemeProvider>
                                        <RaisedButton
                                            label={ this.props.assistant ?
                                                this.state.graduationCheck?"已送審":"未送審"
                                                :
                                                this.state.graduationCheck?"助理已經收到囉":"助理尚未收到"}
                                            disabled={this.props.assistant ?(this.state.graduationCheck) : true}
                                            style={styles.button}
                                            // style={{visibility:'hidden'}}
                                            labelStyle={styles.labelStyle}
                                            backgroundColor = "#DDDDDD"
                                            onClick={()=>this.handleAssistantPost()}
                                        />
                                    </MuiThemeProvider>
                                </ReactHover.Trigger>
                                <ReactHover.Hover type='hover'>
                                </ReactHover.Hover>
                            </ReactHover>

                            <MuiThemeProvider>
                                <RaisedButton style={styles.button}
                                              labelStyle={styles.labelStyle}
                                              backgroundColor = "#DDDDDD"
                                              label="列印"
                                              onClick={() => this.printGradTable('103學年度畢業預審表-'+this.props.studentProfile.student_id)}/>
                            </MuiThemeProvider>

                            <div>
                                <MuiThemeProvider>
                                    <RaisedButton style={styles.buttonEn}
                                                  labelStyle={styles.labelStyle}
                                                  backgroundColor = "#DDDDDD"
                                                  ref="targetEn"
                                                  buttonStyle={{zIndex:'0'}}
                                                  label={(this.state.graduationCheckEnglishTest==="3" || this.state.graduationCheckEnglishTest==="4" )?"已考過英檢":(this.state.graduationCheckEnglishTest==="0")?"未考過英檢":(this.state.graduationCheckEnglishTest==="2")?"英文已換修":"英文已抵免"}
                                                  disabled={true}/>
                                </MuiThemeProvider>
                            </div>
                            <MuiThemeProvider>

                                    <RaisedButton style={{
                                        margin:'9px 10px 0 0px',
                                        width:'200px',
                                        float:'left',
                                        zIndex:'-1',
                                        transition:'visibility 0.5s',
                                        visibility:this.state.isToggle?'hidden':''
                                    }}
                                                  labelStyle={styles.labelStyle}
                                                  label="編輯課程"
                                                  onClick={this.handleOpenforRevise}
                                                  backgroundColor = "#DDDDDD"
                                                  disabled={this.props.assistant}/>
                            </MuiThemeProvider>
                                    <MuiThemeProvider>
                                    <Dialog
                                        title={<div>編輯課程  (用<font color="#8b0000">拖曳</font>課程的方式編輯。您可以<font color="#8b0000">點選標題</font> ex:共同必修，確認自己尚需幾學分)</div>}
                                        actions={actions}
                                        modal={false}
                                        open={this.state.openforRevise}
                                        onRequestClose={this.handleCloseforRevise}
                                        autoScrollBodyContent
                                        contentStyle={customContentStyle}
                                        bodyStyle={bodyStyle}
                                        titleStyle={titleStyle}
                                    >
                                        <App post = {this.state.post} />
                                    </Dialog>

                            </MuiThemeProvider>
                            <div style={{width:'500px', height:'10px'}} className="animated shake">
                            <MuiThemeProvider>
                                <Toggle
                                    label="系統自動排序"
                                    style={styles.toggle}
                                    defaultToggled
                                    labelStyle={styles.labelStyle}
                                    onToggle={(toggled)=>this.handleToggle()}
                                />
                            </MuiThemeProvider>
                            <MuiThemeProvider>
                                <IconButton tooltipStyles={{zIndex:'1000',fontFamily:'Noto Sans CJK TC'}}
                                            iconStyle={styles.medium}
                                            tooltip="排序依據"
                                            tooltipPosition="top-right"
                                            ref="target"
                                            onClick={()=>this.handleClickview()}>
                                    <ActionGrade />
                                </IconButton>
                            </MuiThemeProvider>
                            </div>
                            <Popover
                                placement='right'
                                target={this.refs.target}
                                show={this.state.open}
                                onHide={()=>this.handleClose()}
                                style={{
                                    width:'auto',
                                    opacity:'0.8',
                                    zIndex:'100'
                                }}>
                                <div
                                    style={styles.pop}>
                                    {this.state.isToggle?
                                        <div><b>-未排序</b><br/>
                                            物理學分放置規則：於必修項目會算為3學分,多的2學分將優先放至專業選修,若專業選修已滿,則會放至其他選修,物理也會顯示在該項項目中。</div>
                                        :
                                        <div><b>-已排序</b><br/><br/>
                                            <b>重複修課</b>：將只顯示一次,取成績最高的那次<br/>
                                            <br/><b>必修：</b>若有多修物理,化學或生物,會將多修的課程優先放至專業選修,若專業選修學分已滿,則放至其他選修。<br/>
                                            <br/><b>物理學分放置規則：</b>於必修項目會算為3學分,多的1學分將優先放至專業選修,若專業選修已滿,則會放至其他選修,物理也會顯示在該項項目中。<br/>
                                            <br/><b>核心課程/副核心及他組合心課程：</b>若該項總學分已達畢業標準,會將多修的課程優先放至專業選修,若專業選修學分已滿,則放至其他選修。<br/>
                                            <br/><b>專業選修/外語/通識：</b>若該項總學分已達畢業標準,會將多修的課程放至其他選修。<br/></div>}
                                </div>
                            </Popover>
                        </div>
                    </div>
                </div>
                <ToastContainer autoClose={10000} style={{margin:'50px 0 0 0'}}/>
                <MuiThemeProvider>
                    <CreditOverview
                    items={this.state.items}
                    result={this.state.totalitems}
                    revise={this.state.graduationItems}
                    reviseresult={this.state.ReviseResult}
                    studentProfile={this.props.studentProfile}
                    courseCategoryArray={this.state.print_courseCategoryArray}
                    isMod={this.state.isMod}
                    isToggle={this.state.isToggle}
                    openforRevise/>
                </MuiThemeProvider>
            </div>

        )
    }
}

export default GradCreditCheck

// <RaisedButton style={styles.button}
// labelStyle={styles.labelStyle}
// backgroundColor = "#DDDDDD"
// label={this.state.isMod?"查看課程":"編輯課程"}
// onClick={()=>this.Modify()}/>