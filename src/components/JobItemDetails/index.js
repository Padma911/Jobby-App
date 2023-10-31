import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {BsStarFill} from 'react-icons/bs'

import {MdLocationOn, MdWork} from 'react-icons/md'

import {BiLinkExternal} from 'react-icons/bi'

import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

const appConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetails: [],
    appStatus: appConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  tryAgain = () =>
    this.setState({appStatus: appConstants.initial}, this.getJobItemDetails)

  successItemView = () => {
    const {jobItemDetails} = this.state
    const {jobDetail, skills, lifeAtCompany, similarJobs} = jobItemDetails
    console.log(jobDetail, skills, lifeAtCompany)

    return (
      <div className="job-item-success-container">
        <div className="top-container">
          <div className="icon-container">
            <img
              src={jobDetail.companyLogoUrl}
              className="company-logo"
              alt="job details company logo"
            />
            <div className="role-holder">
              <h1 className="role-names">{jobDetail.title}</h1>
              <div className="rating-holder">
                <BsStarFill className="star-image" />
                <p className="rating">{jobDetail.rating}</p>
              </div>
            </div>
          </div>
          <div className="job-middle-container">
            <div className="location-holder">
              <div className="icon-holder">
                <MdLocationOn className="md-icon" />
                <p className="icon-name">{jobDetail.location}</p>
              </div>
              <div className="icon-holder">
                <MdWork className="md-icon" />
                <p className="icon-name">{jobDetail.employmentType}</p>
              </div>
            </div>
            <p className="salary">{jobDetail.packagePerAnnum}</p>
          </div>
          <hr />
          <div className="desc-holder">
            <h1 className="description-heading">Description</h1>
            <a
              href={jobDetail.companyWebsiteUrl}
              rel="noreferrer"
              target="_blank"
            >
              <p className="violet-text">
                Visit <BiLinkExternal className="visit" />
              </p>
            </a>
          </div>
          <p className="description-para">{jobDetail.jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list">
            {skills.map(eachItem => (
              <li className="skill-item" key={eachItem.name}>
                <img
                  src={eachItem.imageUrl}
                  className="skill-image"
                  alt={eachItem.name}
                />
                <p className="skill-name">{eachItem.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-holder">
            <p className="life-at-company-description">
              {lifeAtCompany.description}
            </p>
            <img
              src={lifeAtCompany.imageUrl}
              className="life-at-company-image"
              alt="life at company"
            />
          </div>
        </div>
        <div className="bottom-container">
          <h1 className="similar-heading">Similar Jobs</h1>
          <ul className="similar-list">
            {similarJobs.map(eachValuee => (
              <li className="similar-item" key={eachValuee.id}>
                <div className="icon-container">
                  <img
                    src={eachValuee.companyLogoUrl}
                    className="company-logo"
                    alt="similar job company logo"
                  />
                  <div className="role-holder">
                    <h1 className="role">{eachValuee.title}</h1>
                    <div className="rating-holder">
                      <BsStarFill className="star-image" />
                      <p className="rating">{eachValuee.rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="description">Description</h1>
                <p className="description-para">{eachValuee.jobDescription}</p>
                <div className="job-middle-container">
                  <div className="location-holder">
                    <div className="icon-holder">
                      <MdLocationOn className="md-icons" />
                      <p className="icon-names">{eachValuee.location}</p>
                    </div>
                    <div className="icon-holder">
                      <MdWork className="md-icons" />
                      <p className="icon-names">{eachValuee.employmentType}</p>
                    </div>
                  </div>
                  <p className="salary">{eachValuee.packagePerAnnum}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  failureItemView = () => (
    <div className="main-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="failure-retry-button"
        onClick={this.tryAgain}
      >
        Retry
      </button>
    </div>
  )

  updateDetails = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    companyWebsiteUrl: data.company_website_url,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  life = data => ({
    description: data.description,
    imageUrl: data.image_url,
  })

  getJobItemDetails = async () => {
    this.setState({appStatus: appConstants.progress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      console.log('ok')
      const jobDetail = this.updateDetails(data.job_details)

      const skills = data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))

      const lifeAtCompany = this.life(data.job_details.life_at_company)

      const similarJob = data.similar_jobs.map(eachValue => ({
        companyLogoUrl: eachValue.company_logo_url,
        employmentType: eachValue.employment_type,
        id: eachValue.id,
        jobDescription: eachValue.job_description,
        location: eachValue.location,
        rating: eachValue.rating,
        title: eachValue.title,
      }))
      console.log('similarJob', similarJob)
      const jobItem = {
        jobDetail,
        lifeAtCompany,
        skills,
        similarJobs: similarJob,
      }
      this.setState({jobItemDetails: jobItem, appStatus: appConstants.success})
    } else {
      this.setState({jobItemDetails: '', appStatus: appConstants.failure})
    }
  }

  getItemView = () => {
    const {appStatus, jobItemDetails} = this.state
    console.log(appStatus, jobItemDetails)
    switch (appStatus) {
      case appConstants.success:
        if (jobItemDetails.length !== 0) {
          return this.successItemView()
        }
        return this.failureItemView()
      case appConstants.failure:
        return this.failureItemView()
      default:
        return this.loaderView()
    }
  }

  loaderView = () => (
    <div className="main-loader-container">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  render() {
    return (
      <div className="job-item-main-container">
        <Header />
        {this.getItemView()}
      </div>
    )
  }
}

export default JobItemDetails
