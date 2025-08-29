import { Component } from "react"
import Cookies from "js-cookie"
import Navbar from "../Header"
import Sidebar from "../Sidebar"
import "./index.css"

class AssignNotification extends Component {
  state = {
    title: "",
    message: "",
    isSubmitting: false,
    isSuccess: false,
    errorMsg: "",
  }

  onChangeTitle = event => {
    this.setState({ title: event.target.value })
  }

  onChangeMessage = event => {
    this.setState({ message: event.target.value })
  }

  submitAnotherNotification = () => {
    this.setState({
      title: "",
      message: "",
      isSubmitting: false,
      isSuccess: false,
      errorMsg: "",
    })
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const { title, message } = this.state
    this.setState({ isSubmitting: true, errorMsg: "" })

    const jwtToken = Cookies.get("jwt_token")
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/admin/notifications/`;
    const notificationDetails = {
      title,
      message,
      targetType:"member"
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(notificationDetails),
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        this.setState({ isSuccess: true })
      } else {
        const data = await response.json()
        this.setState({
          errorMsg: data.error_msg || "Failed to post notification",
        })
      }
    } catch (error) {
      this.setState({ errorMsg: "Something went wrong. Try again later." })
    } finally {
      this.setState({ isSubmitting: false })
    }
  }

  renderSuccessView = () => (
    <div className="success-view">
      <img
        className="image"
        src="https://assets.ccbp.in/frontend/react-js/success-icon-img.png"
        alt="success"
      />
      <h1 className="submitted-text">Notification Posted Successfully</h1>
      <button
        className="button"
        type="button"
        onClick={this.submitAnotherNotification}
      >
        Post Another Notification
      </button>
    </div>
  )

  renderForm = () => {
    const { title, message, isSubmitting, errorMsg } = this.state

    return (
      <form className="notification-form" onSubmit={this.onSubmitForm}>
        <h1 className="form-heading">Post Notification</h1>

        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={this.onChangeTitle}
          className="form-input"
          required
        />

        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={this.onChangeMessage}
          className="form-textarea"
          rows="4"
          required
        />

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Notification"}
        </button>
      </form>
    )
  }

  render() {
    const { isSuccess } = this.state
    return (
      <div className="bg-container">
        <Navbar />
        <div className="main-body">
          <Sidebar />
          <div className="content">
            {isSuccess ? this.renderSuccessView() : this.renderForm()}
          </div>
        </div>
      </div>
    )
  }
}

export default AssignNotification
