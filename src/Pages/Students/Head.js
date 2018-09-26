import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import FadeIn from 'react-fade-in'
import {Grid,Row,Col} from 'react-bootstrap'

import HomeItem from './Home/Home.js'
import MapItem from './Map/MapComponents/Map.js'
import GradCreditCheckPage from './Graduation/GradCreditCheck.js'

import Navbar from '../../Components/Navbar'
import Loading from '../../Components/Loading'

import defaultData from '../../Resources/FakeData'

let graduationItems = defaultData.GraduationItems
let revise = defaultData.GraduationItems_Revised
let studentCos = defaultData.Course
let studentPas = defaultData.CoursePass
let printData = defaultData.PrintData

let MapCourseData
let StudentCosPas
let loadFlag = 0

class Head extends Component {

  state = {
    selectedIndex: 0,
    studentIdcard: {
      sname: '資料錯誤',
      student_id: '0000000',
      program: '網多',
      grade: '大一',
      email: 'hihi@gmail.com',
    },
    print_courseCategoryArray: printData
  }

  ReloadGrad () {
    loadFlag = true
    window.location.reload()
  }

  async componentWillMount () {
    await this.res()
    let _this = this
    console.log(MapCourseData)
    setTimeout(function () {
      _this.select(0)
    }, 100)
  }

  res () {
    let _this = this
    axios.get('/students/graduate/original').then(studentData => {
      graduationItems = studentData.data
    }).catch(err => {
      console.log(err)
    })
    axios.get('/students/graduate/revised').then(studentData => {
      revise = studentData.data

    }).catch(err => {
      console.log(err)
    })

    axios.get('/students/profile').then(studentData => {
      studentData.data[0].grade = '大' + studentData.data[0].grade
      _this.setState({
        studentIdcard: studentData.data[0]
      })
    }).catch(err => {
      console.log(err)
    })
    MapCourseData = Object.keys(studentCos).map(function (key) {
      let user = studentCos[key]
      user.id = key
      return user
    })
    StudentCosPas = Object.keys(studentPas).map(function (key) {
      let user = studentPas[key]
      user.id = key
      return user
    })
    axios.get('/students/courseMap').then(studentData => {
      MapCourseData = Object.keys(studentData.data).map(function (key) {
        let user = studentData.data[key]
        user.id = key
        return user
      })
    }).catch(err => {
      console.log(err)
    })
    axios.get('/students/coursePass').then(studentData => {
      // studentData.status HTTP response code (e.g., 200, 401)
      // studentData.data object parsed from HTTP response body
      // studentData.headers  HTTP presonse headers

      StudentCosPas = Object.keys(studentData.data).map(function (key) {
        let user = studentData.data[key]
        user.id = key
        return user
      })

    }).catch(err => {
      console.log(err)
    })

    axios.get('/students/graduate/print').then(function (resp) {
      this.setState({
        print_courseCategoryArray: resp.data
      })

    }.bind(this)).catch(err => {
      console.log(err)
    })

  }

  componentDidMount () {
  }

  select (index) {
    if (index === 0) {
      ReactDOM.render(
        <FadeIn>
          <HomeItem/>
        </FadeIn>,
        document.getElementById('page'))
    }
    else if (index === 1) {
      ReactDOM.render(
        <font>
          <FadeIn>
            <GradCreditCheckPage
              items={graduationItems}
              result={graduationItems[11]}
              revise={revise}
              reviseresult={revise[11]}
              studentProfile={this.state.studentIdcard}
              courseCategoryArray={this.state.print_courseCategoryArray}/>
          </FadeIn>
        </font>,
        document.getElementById('page'))
    }
    else if (index === 2) {
      ReactDOM.render(
        <div>
          <FadeIn>
            <MapItem
              studentPasdata={StudentCosPas}
              data={MapCourseData}
              studentId={this.state.studentIdcard.program}
              studentsGrad={this.state.studentIdcard.grade}/>
          </FadeIn>
        </div>,
        document.getElementById('page'))
    }
    else if (index === 3) {
      ReactDOM.render(
        <a>
          <FadeIn>
            <MapItem/>
          </FadeIn>
        </a>,
        document.getElementById('page'))
    }

    this.setState({selectedIndex: index})
  }

// <BottomNavigationItem
//     label="抵免"
//     icon={checkIcon}
//     style={this.state.styleButton}
// onTouchTap={() => this.select(3)}
// />
  render () {
    const onTouchTaps = [
      () => this.select(0),
      () => this.select(1),
      () => this.select(2),
    ]
    return (
      <Grid id="Head">
        <Row>
          <Navbar type={this.state.studentIdcard.grade === "大一" ? 'studentonlyformap' : 'student'}
                  version={this.state.studentIdcard.grad}
                  name={this.state.studentIdcard.sname}
                  subname={this.state.studentIdcard.program + this.state.studentIdcard.grade}
                  selectedIndex={this.state.studentIdcard.grade === "大一" ? this.state.selectedIndex - 1 : this.state.selectedIndex}
                  onTouchTaps={onTouchTaps}
          />
          <Col sm={12} xsHidden smHidden>
            <div id="page" >
              <Loading size={300}
                       left={600}
                       top={200}
                       isLoading={true}
              />
            </div>
          </Col>
          {/* For mobile, tablet user */}
          <Col xs={12} mdHidden lgHidden>
            <h2>行動版功能目前測試中，造成不便敬請見諒。</h2>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default Head
