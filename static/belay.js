// MAIN COMPONENT ========================================
class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      channelList: null,
      currentChannelid: null,
      replyPanePresent: false,
      replyList: null,
      uuid: null,
      user_id: null,
      body: null,
      name: null,
      signup: false,
      url: null,
      changeUserDetailsBool: false,
      unreadMessages: null,
      windowSizeVariable: window.innerWidth,
      smallWindowState: null,
    }

    window.addEventListener('resize', this.handleWindowSizeChange);


    // setting the intitial state of the app
    if (window.localStorage.getItem("divyapattisapu_belay_auth_key") !== null) {
      this.state.loggedIn = true;
    }


    this.updatecurrentChannelid = this.updatecurrentChannelid.bind(this);
    this.closeThreads = this.closeThreads.bind(this);
    this.displayThreads = this.displayThreads.bind(this);
    this.updateApiKey = this.updateApiKey.bind(this);
    this.goToSignUp = this.goToSignUp.bind(this);
    this.changeURL = this.changeURL.bind(this);
    this.changeUserDetails = this.changeUserDetails.bind(this);
    this.updateChannelList = this.updateChannelList.bind(this);
    this.changeWindowSizesNums = this.changeWindowSizesNums.bind(this);
    this.displayHome = this.displayHome.bind(this);
    this.listAllChannels = this.listAllChannels.bind(this);
    this.logOutUser = this.logOutUser.bind(this);


    this.state.url = window.location.pathname;
    console.log("initial url", this.state.url)

    if (this.state.loggedIn === false) {
      // if the user is not logged in, show the login page
      this.state.url = "/login";
      history.pushState({}, '', this.state.url);
      this.state.signup = false;
    }

    // if the url is /signup, show the signup page
    else if (this.state.url === "/signup") {
      this.state.signup = true;
      this.state.loggedIn = false;
    }

    // if the url is /login, show the login page
    else if (this.state.url === "/login") {
      this.state.signup = false;
    }

    else if (this.state.url === "/changeuserdetails") {
      this.state.changeUserDetailsBool = true;
    }

    // if the url is /channel/uuid/thread/uuid, show the thread page
    // perform string parsing to get the uuids
    const url = this.state.url;
    const urlArray = url.split("/");
    console.log("urlArray", urlArray)
    if (urlArray[1] === "channel") {
      // check the length of the array
      if (urlArray.length === 3) {
        // this is a channel page
        console.log("channel page", urlArray[2])
        this.state.currentChannelid = urlArray[2];
        console.log("currentChannelid", this.state.currentChannelid)
      }
      else if (urlArray.length === 5) {
        // this is a thread page
        console.log("thread page", urlArray[2], urlArray[4])
        this.state.currentChannelid = urlArray[2];
        this.state.replyPanePresent = true;
        this.state.uuid = urlArray[4];
      }
    }

    else if (urlArray[1] === "thread") {
      // this is a thread page
      console.log("thread page only", urlArray[2])
      this.state.replyPanePresent = true;
      this.state.uuid = urlArray[2];
    }

    else if (urlArray[1] === "home") {
      // this is the home page
      // FILL IN LATER
      this.state.loggedIn = true;
    }

  }

  displayHome() {

      this.setState({ url: "/" })
      history.pushState({}, '', '/');
      this.setState({ loggedIn: true })
      // this.setState({ currentChannelid: null })
      // this.setState({ replyPanePresent: false })
      // this.setState({ replyList: null })
      // this.setState({ uuid: null })
      // this.setState({ user_id: null })
      // this.setState({ body: null })
      // this.setState({ name: null })
      // this.setState({ signup: false })
      // this.setState({ changeUserDetailsBool: false })
      // this.setState({ unreadMessages: null })
      // this.setState({ windowSizeVariable: window.innerWidth })
      // this.setState({ smallWindowState: null })



    // }
  }


  // displayLogin() {
  //   this.setState({ url: "/login" })
  //   history.pushState({}, '', '/login');
  //   this.setState({ loggedIn: false })
  //   this.setState({ currentChannelid: null })
  //   this.setState({ replyPanePresent: false })
  //   this.setState({ replyList: null })
  //   this.setState({ uuid: null })
  //   this.setState({ user_id: null })
  //   this.setState({ body: null })
  //   this.setState({ name: null })
  //   this.setState({ signup: false })
  //   this.setState({ changeUserDetailsBool: false })
  //   // this.setState({ unreadMessages: null })
  //   // this.setState({ windowSizeVariable: window.innerWidth })
  //   // this.setState({ smallWindowState: null })
  // }

  logOutUser(){
    this.setState({
      url : "/login",
      loggedIn : false
  });
  this.setState({ currentChannelid: null })
  this.setState({ replyPanePresent: false })
  this.setState({ replyList: null })
  this.setState({ uuid: null })
  this.setState({ user_id: null })
  this.setState({ body: null })
  this.setState({ name: null })
  this.setState({ signup: false })
  this.setState({ changeUserDetailsBool: false })
  window.localStorage.removeItem("divyapattisapu_belay_auth_token");
  history.pushState({}, '', '/login');
  }

  handleWindowSizeChange = () => {
    this.setState({ windowSizeVariable: window.innerWidth });
    if (window.innerWidth < 700) {
      this.setState({
        smallWindowState: 2,
      })
    }
    else {
      this.setState({
        smallWindowState: null,
      })
    }
  };


  updatecurrentChannelid(uuid) {
    this.setState({ currentChannelid: uuid })
    console.log("MAIN is updating updatecurrentChannelid", uuid, this.state.currentChannelid)

  }




  componentDidUpdate(prevProps, prevState) {
    // // console.log("main did update")

    console.log("main did update")
    // if (prevProps.currentChannelid !== this.props.currentChannelid) {
    //   this.setState({ currentChannelid: this.props.currentChannelid });
    // }


    if (this.state.url !== prevState.url) {
      console.log("url changed")
      history.pushState({}, '', this.state.url);
    }

    if (this.state.loggedIn !== prevState.loggedIn && this.state.loggedIn === true) {
      console.log("loggedIn changed to true")
        this.listAllChannels();
        this.setState({ url: "/" })
    }


    // if (this.state.signup !== prevState.signup && this.state.signup === true ) {
    //   // this.setState({ url: "/signup" })
    //   history.pushState({}, '', '/signup');
    // }


    // if (this.state.loggedIn === false) {
    //   if (this.state.signup === true) {
    //     // this.setState({ url: "/signup" })
    //     history.pushState({}, '', '/signup');
    //   }
    //   else {
    //     // this.setState({ url: "/login" })
    //     history.pushState({}, '', '/login');
    //   }
    // }

    // if (this.state.loggedIn === true) {
    //   // this.setState({ url: "/channel/" + this.state.currentChannelid })
    //   history.pushState({}, '', '/channel/' + this.state.currentChannelid);
    // }

    if (this.state.url != prevState.url) {

      this.state.url = window.location.pathname;
      console.log("initial url", this.state.url)

      if (this.state.loggedIn === false) {
        // if the user is not logged in, show the login page
        this.setState({ signup: false });
      }

      // if the url is /signup, show the signup page
      else if (this.state.url === "/signup") {
        this.setState({ signup: true });
        this.setState({ loggedIn: false });
      }


      // if the url is /login, show the login page
      else if (this.state.url === "/login") {
        this.setState({ signup: false });
      }

      else if (this.state.url === "/changeuserdetails") {
        this.setState({ changeUserDetailsBool: true });
      }

      // if the url is /channel/uuid/thread/uuid, show the thread page
      // perform string parsing to get the uuids
      const url = this.state.url;
      const urlArray = url.split("/");
      console.log("urlArray", urlArray)
      if (urlArray[1] === "channel") {
        // check the length of the array
        if (urlArray.length === 3) {
          // this is a channel page
          console.log("channel page", urlArray[2])
          this.setState({ currentChannelid: urlArray[2] });
          console.log("currentChannelid", this.state.currentChannelid)
          this.setState({ replyPanePresent: false });
        }
        else if (urlArray.length === 5) {
          // this is a thread page
          console.log("thread page", urlArray[2], urlArray[4])
          this.setState({ currentChannelid: urlArray[2] });
          this.state.replyPanePresent = true;
          this.setState({ uuid: urlArray[4] });
          this.setState({ replyPanePresent: true });
        }
      }

      else if (urlArray[1] === "thread") {
        // this is a thread page
        console.log("thread page only", urlArray[2])
        this.state.replyPanePresent = true;
        this.setState({ uuid: urlArray[2] });
        this.setState({ replyPanePresent: true });
      }

      else {
        // this is the home page
        // FILL IN LATER
      }
    }

  }

  updateChannelList(props) {
    // append the new channel to the channel list
    // // console.log("updating channel list", props)
    let list_channels = this.state.channelList
    list_channels.push(props)

    this.setState({
      channelList: list_channels
    });
  }

  closeThreads() {
    this.setState({
      replyPanePresent: false,
    });

    this.changeURL("/channel/" + this.state.currentChannelid)

    if (this.state.smallWindowState !== null) {
      this.changeWindowSizesNums(2);
    }
    // console.log(this.state.replyPanePresent)
  }

  displayThreads(props, uuid, user_id, body, name, timestamp = null) {
    this.setState({
      replyPanePresent: true,
    });

    this.setState({
      replyList: props,
    });
    console.log("display threads", this.state.replyList, props)
    console.log("props, uuid, user_id, body, name", props, uuid, user_id, body, name)

    this.setState({
      uuid: uuid,
      user_id: user_id,
      body: body,
      name: name,
    });

    if (this.state.smallWindowState !== null) {
      this.changeWindowSizesNums(3);
    }
  }

  goToSignUp() {
    this.setState({
      signup: true
    })
    console.log("going to sign up")

  }

  componentDidMount() {
    // // console.log("main did mount")
    // make an api call to the list of channels
    console.log("127")

    window.addEventListener("locationchange", (newState) => {

      this.setState({ url: document.location });
    })

    window.addEventListener("popstate", (newState) => {
      console.log("location: " + window.location.pathname + ", state: " + JSON.stringify(newState));
      this.setState({ url: window.location.pathname });
    }
    )

    if (this.state.loggedIn === true) {
      this.listAllChannels()
    }

    // }

    // make first channel active
    // this.setState({ currentChannelid: this.state.channelList[0].name })

  }


  listAllChannels() {
    const data = fetch('/api/listchannels',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
      },
    }
  )
    .then(response => response.json())
    .then(data => {
      console.log('List CHannels: ', data);
      this.setState({ channelList: data })
      // error handling
      if (data.error) {
        console.log("error", data.error)
        this.changeURL("/")
        history.pushState({}, '', '/');
      }
      if (data.length > 0) {
        if (this.state.currentChannelid === null) {
          this.updatecurrentChannelid(data[0].uuid);
        }
        else {
          this.updatecurrentChannelid(this.state.currentChannelid);
        }

      }
    }
    )
  }

  changeUserDetails() {
    console.log("change user details")
    this.setState({ changeUserDetailsBool: true })
  }

  latestMessages() {

    // make an api call to the list of channels
    const data = fetch('/api/unreadmessages',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
        },
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log('258 =========== Success:', data);


      })
      .then(data => {
        this.setState({ unreadMessages: data })
      })

  }

  updateApiKey(api_key) {
    this.setState({ loggedIn: true });
    console.log("api key updated", api_key)

  }

  changeURL(new_url) {
    console.log("changing url from Main to: ", new_url)
    this.setState({ url: new_url })
  }

  changeWindowSizesNums(num) {
    this.setState({ smallWindowState: num })
  }

  render() {
    let styles_center = {
      width: 'calc(100% - 30vw)',
      display: 'block',
      marginLeft: '15vw',
      marginRight: '15vw',
      position: 'absolute',
      top: '0',
      bottom: '0'
    };
    let styles_right = {
      position: 'fixed',
      right: '0',
      top: '0',
      bottom: '0',
      width: '30vw',
      height: '100vh',
      marginLeft: '70vw',
      size: '20vw'
    };

    // console.log("thread pane present?: ", this.state.replyPanePresent)
    // // console.log("render main", channelList)
    // // console.log("render main", currentChannelid)
    // // console.log("MAIN is updating updatecurrentChannelid", this.state.currentChannelid, currentChannelid)

    // if (this.state.loggedIn === false) {
    //   return <Login updateApiKey={this.updateApiKey} goToSignUp={this.goToSignUp} />
    // }

    // // if the url is /signup, show the signup page
    // if (this.state.url === "/signup") {
    //   return <SignUp updateApiKey={this.updateApiKey} />
    // }

    // // if the url is /login, show the login page
    // if (this.state.url === "/login") {
    //   return <Login updateApiKey={this.updateApiKey} goToSignUp={this.goToSignUp} />
    // }

    // // if the url is /channel/uuid/thread/uuid, show the thread page
    // // perform string parsing to get the uuids

    // const url = this.state.url;
    // const urlArray = url.split("/");
    // console.log("urlArray", urlArray)
    // if (urlArray[1] === "channel" && urlArray[3] === "thread") {
    //   // set the current channel id
    //   // set the uuid
    // }

    // else if (urlArray[1] === "channel") {
    //   // set the current channel id
    // }



    // if (this.state.url === "/channel/" + this.state.currentChannelid + "/thread/" + this.state.uuid) {
    //   return <React.Fragment>
    //     {channelList && <Channels channelList={channelList} updatecurrentChannelid={this.updatecurrentChannelid} currentChannelid={this.state.currentChannelid} changeURL={this.changeURL} />}
    //     {currentChannelid && <Messages currentChannelid={this.state.currentChannelid} displayThreads={this.displayThreads} changeURL={this.changeURL} />}
    //     {this.state.replyPanePresent && <ReplyPane closeThreads={this.closeThreads} replyList={this.state.replyList} uuid={this.state.uuid} user_id={this.state.user_id} body={this.state.body} />}
    //   </React.Fragment>
    // }

    // // if the url is /channel/uuid, show the channel page
    // if (this.state.url === "/channel/" + this.state.currentChannelid) {
    //   return <React.Fragment>
    //     {channelList && <Channels channelList={channelList} updatecurrentChannelid={this.updatecurrentChannelid} currentChannelid={this.state.currentChannelid} changeURL={this.changeURL} />}
    //     {currentChannelid && <Messages currentChannelid={this.state.currentChannelid} displayThreads={this.displayThreads} changeURL={this.changeURL} />}
    //     {this.state.replyPanePresent && <ReplyPane closeThreads={this.closeThreads} replyList={this.state.replyList} uuid={this.state.uuid} user_id={this.state.user_id} body={this.state.body} />}
    //   </React.Fragment>
    // }

    // else{
    //   // if the user is logged in, but the url is not /channel/uuid, show the channel page
    //   return <React.Fragment>
    //     {channelList && <Channels channelList={channelList} updatecurrentChannelid={this.updatecurrentChannelid} currentChannelid={this.state.currentChannelid} changeURL={this.changeURL} />}
    //     {currentChannelid && <Messages currentChannelid={this.state.currentChannelid} displayThreads={this.displayThreads} changeURL={this.changeURL} />}
    //     {this.state.replyPanePresent && <ReplyPane closeThreads={this.closeThreads} replyList={this.state.replyList} uuid={this.state.uuid} user_id={this.state.user_id} body={this.state.body} />}
    //   </React.Fragment>
    // }

    // if ((this.state.url === "/login" || this.state.url === "/" || this.state.url === "") )
    // {

    //   if (this.state.loggedIn === false) {
    //     if (this.state.signup === true) {
    //       return <SignUp updateApiKey={this.updateApiKey} />
    //     }

    //     else{
    //       return <Login updateApiKey={this.updateApiKey} goToSignUp={this.goToSignUp} />
    //     }
    //   }

    //   else {
    //     return <React.Fragment>
    //       {channelList && <Channels channelList={channelList} updatecurrentChannelid={this.updatecurrentChannelid} currentChannelid={this.state.currentChannelid} changeURL={this.changeURL} />}
    //       {currentChannelid && <Messages currentChannelid={this.state.currentChannelid} displayThreads={this.displayThreads} changeURL={this.changeURL} />}
    //       {this.state.replyPanePresent && <ReplyPane closeThreads={this.closeThreads} replyList={this.state.replyList} uuid={this.state.uuid} user_id={this.state.user_id} body={this.state.body} />}
    //     </React.Fragment>
    //   }
    // }

    // else if (this.state.url === "/channel/" + this.state.currentChannelid){


    // else if (this.state.url === "/signup"){
    //   return <SignUp updateApiKey={this.updateApiKey} />
    // }

    // else if (this.state.url === "/channel/" + this.state.currentChannelid){

    if (this.state.smallWindowState === 2) {
      return <React.Fragment>
        {<Center styles={styles_center} currentChannelid={this.state.currentChannelid} replyPanePresent={this.state.replyPanePresent} displayThreads={this.displayThreads} changeURL={this.changeURL} changeWindowSizesNums={this.changeWindowSizesNums} />}
        {<button className="channel-list-small" onClick={() => {
          this.changeWindowSizesNums(1);
        }}> Channel List </button>}
      </React.Fragment>
    }

    else if (this.state.smallWindowState === 1) {
      return this.state.channelList && <Channels displayLogin={this.displayLogin} channelList={this.state.channelList} updatecurrentChannelid={this.updatecurrentChannelid} currentChannelid={this.state.currentChannelid} changeURL={this.changeURL} changeUserDetails={this.changeUserDetails} updateChannelList={this.updateChannelList} changeWindowSizesNums={this.changeWindowSizesNums} />
    }

    else if (this.state.smallWindowState === 3) {
      return <RightPanel styles={styles_right} closeButtonFn={this.closeThreads} replyPanePresent={this.state.replyPanePresent} replyList={this.state.replyList} uuid={this.state.uuid} user_id={this.state.user_id} body={this.state.body} name={this.state.name} channel_id={this.state.currentChannelid} changeURL={this.changeURL} />
    }


    if (this.state.loggedIn !== true) {
      if (this.state.signup === true) {
        // history.pushState({}, '', '/signup');
        return <SignUp updateApiKey={this.updateApiKey} />
      }
      else {
        // history.pushState({}, '', '/login');
        return <Login updateApiKey={this.updateApiKey} goToSignUp={this.goToSignUp} changeURL={this.changeURL} displayHome={this.displayHome}/>
      }
    }

    else if (this.state.changeUserDetailsBool === true) {
      return <ChangeUserDetails displayHome={this.displayHome}/>
    }

    else {
      console.log("Line 358 url", this.state.url)
      console.log("Line 359 currentChannelid", this.state.currentChannelid)
      // this.latestMessages();

      return <React.Fragment>
        {this.state.channelList && <Channels logOutUser={this.logOutUser} channelList={this.state.channelList} updatecurrentChannelid={this.updatecurrentChannelid} currentChannelid={this.state.currentChannelid} changeURL={this.changeURL} changeUserDetails={this.changeUserDetails} updateChannelList={this.updateChannelList} />}
        <div className="center-right">
          {this.state.replyPanePresent && <Center currentChannelid={this.state.currentChannelid} replyPanePresent={this.state.replyPanePresent} displayThreads={this.displayThreads} changeURL={this.changeURL} />}
          {(!this.state.replyPanePresent) && <Center styles={styles_center} currentChannelid={this.state.currentChannelid} replyPanePresent={this.state.replyPanePresent} displayThreads={this.displayThreads} changeURL={this.changeURL} />}
          {/* {this.state.replyPanePresent && } */}
          {this.state.replyPanePresent && <RightPanel styles={styles_right} closeButtonFn={this.closeThreads} replyPanePresent={this.state.replyPanePresent} replyList={this.state.replyList} uuid={this.state.uuid} user_id={this.state.user_id} body={this.state.body} name={this.state.name} channel_id={this.state.currentChannelid} changeURL={this.changeURL} />}
        </div>
        {/* <ReplyPanel replyPanePresent={this.state.replyPanePresent} closeThreads={() => { this.closeThreads() }} displayThreads={() => { this.displayThreads() }} /> */}
      </React.Fragment>
    }
  }
}

// // CHANNELS SIDE BAR COMPONENT ========================================
// class ChannelsSideBar extends React.Component {
//     constructor(props) {
//       super(props);
//       this.logOut = this.logOut.bind(this);
//       this.state = {
//         changeUserDetailsBool: false,
//       }
//       this.createChannel = this.createChannel.bind(this);


//     }


//     logOut() {
//       console.log("logging out")
//       window.localStorage.removeItem("api_key");
//       // history.pushState("/login", "Login", "/login");
//     }

//     createChannel() {
//       console.log("creating channel")

//       // get the data from add-channel-textarea
//       let new_channelName = document.querySelector(".add-channel-textarea").value;

//       const data = fetch('/api/create_channel', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
//         },
//         body: JSON.stringify({ "name": new_channelName }),
//       })

//         .then(response => response.json())
//         .then(data => {
//           console.log('Success 759:', data);

//           this.props.updateChannelList(data);
//         }
//         )
//     }



//     render() {
//       const { channelList } = this.props;


//       console.log("---render channels", channelList)
//       console.log("---render channels", this.props.currentChannelid)

//       return (
//         <React.Fragment>
//           <div className="channels">
//             <div id="workspace-name"  >Workspace</div>
//             <div id="channel-names-small">
//             {channelList.map((channel) => <Channel key={channel.uuid} uuid={channel.uuid} name={channel.name} showCurrentChannel={this.showCurrentChannel} currentChannelid={this.props.currentChannelid} changeURL={this.props.changeURL} updatecurrentChannelid={this.props.updatecurrentChannelid} />)}
//             </div>
//             <div id="add-channel-container">
//               <div id="plus"><span>+</span></div>
//               <div id="add-channel" onClick={this.createChannel}>Add Channel</div>
//               <textarea className="add-channel-textarea" placeholder="Add Channel"></textarea>
//             </div>
//             <button id="logout" onClick={
//               () => {
//                 this.logOut();
//               }
//             }>Log Out</button>

//             <div className="change-user-details">
//               <button id="change-user-details-button" onClick={() => {
//                 this.props.changeUserDetails();
//               }}>Change User Details</button>
//             </div>
//           </div>

//         </React.Fragment>
//       );
//     }
//   }


// LOGIN COMPONENT ========================================
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      loginSuccess: false,
      loginSubmitted: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

  }

  handleSubmit(event) {
    event.preventDefault();
    

    const data = fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
      },
      body: JSON.stringify(this.state),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        if (data["api_key"]) {
          this.props.changeURL("/");
          // this.chan
          window.localStorage.setItem("divyapattisapu_belay_auth_key", data["api_key"]);
          this.props.updateApiKey(data["api_key"]);
          this.setState({
            loginSuccess: true,
            loginSubmitted: true
          })
          this.props.displayHome();
          // unsuccesful login
        } else {
          this.setState({
            loginSuccess: false,
            loginSubmitted: true
          })

          
          
          
          
          // localS
          
          // redirect to main page
          // window.location.href = "/";
        }
        
      })
    }

    render() {
    return <div className={`login${this.state.loginSuccess ? "" : " fail"}`}>
      <form onSubmit={this.handleSubmit}>
        <label id="login-name">
          Name:
          <input className="form-login" type="text" name="name" value={this.state.name} onChange={this.handleChange} />
        </label>
        <label id="login-password">
          Password:
          <input className="form-login" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
        </label>
        <input className="form-login" id="login-submit-button" type="submit" value="Login" />
      
      {console.log("login success", this.state.loginSuccess)}
      {!this.state.loginSuccess && this.state.loginSubmitted && <div className="login-fail">Login Failed</div>}
      <button className="signup" onClick={() => {
        this.props.goToSignUp();
      }}> Sign Up</button>
      </form>
    </div>

  }
}

// SIGN UP COMPONENT ========================================
class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("handleSubmit")
    console.log("state is", this.state)
    const data = fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
      },
      body: JSON.stringify(this.state)

    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        if (data["api_key"]) {
          this.props.updateApiKey(data["api_key"]);
        }
      })
      .then(() => {
        this.setState({
          name: data['name'],
          password: data['password']
        });
      })
      .then(() => {
        console.log("state is", this.state)
      })
  }

  render() {
    console.log("signup state is", this.state)
    return <div className="signUp">
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" onChange={this.handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>

  }

}

// EMOJI COMPONENT ========================================
class Emoji extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emojiList: [],
      emojiListPresent: false,
      emoji: "",
      emojiPresent: false,
      emojiCount: 0
    }

    this.showEmojiList = this.showEmojiList.bind(this);
    this.hideEmojiList = this.hideEmojiList.bind(this);
    this.selectEmoji = this.selectEmoji.bind(this);
  }

  showEmojiList() {
    this.setState({
      emojiListPresent: true,
    })
  }

  hideEmojiList() {
    this.setState({
      emojiListPresent: false,
    })
  }

  selectEmoji(emoji) {
    this.setState({
      emoji: emoji,
      emojiPresent: true,
    })

    // send emoji to server
    const data = fetch('/api/emoji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
      },
      body: JSON.stringify({ "emoji": emoji }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        this.setState({
          emojiCount: data["emoji_count"]
        })
      }
      )

  }

  render() {
    return (
      <React.Fragment>
        <div className="emoji">
          <div className="emoji-button" onClick={() => { this.showEmojiList() }}>{this.state.emoji}</div>
          {this.state.emoji === "" && <div className="emoji-button" onClick={() => { this.showEmojiList() }}>🙂</div>}
          {this.state.emojiListPresent && <EmojiList selectEmoji={(emoji) => { this.selectEmoji(emoji) }} hideEmojiList={() => { this.hideEmojiList() }} />}
          {this.state.emojiCount}
          {/* {this.state.emojiPresent && <EmojiPresent emoji={this.state.emoji} />} */}
        </div>
      </React.Fragment>
    )
  }
}

// EMOJI LIST COMPONENT ========================================
class EmojiList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emojiList: [],
      emojiListPresent: false,
    }
    this.selectEmoji = this.selectEmoji.bind(this);
  }

  selectEmoji(emoji) {
    this.props.selectEmoji(emoji);
    this.props.hideEmojiList();
  }

  render() {
    return (
      <React.Fragment>
        <div className="emoji-list">
          <div className="emoji-list-item" onClick={() => { this.selectEmoji("😁") }}>😁</div>
          <div className="emoji-list-item" onClick={() => { this.selectEmoji("😂") }}>😂</div>
          <div className="emoji-list-item" onClick={() => { this.selectEmoji("😄") }}>😄</div>
          <div className="emoji-list-item" onClick={() => { this.selectEmoji("😆") }}>😆</div>
          <div className="emoji-list-item" onClick={() => { this.selectEmoji("😉") }}>😉</div>
          <div className="emoji-list-item" onClick={() => { this.selectEmoji("😊") }}>😊</div>

        </div>
      </React.Fragment>
    )
  }
}

// EMOJI PRESENT COMPONENT ========================================
class EmojiPresent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emoji: "",
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="emoji-present">
          {this.props.emoji}
        </div>
      </React.Fragment>
    )
  }
}

// EMOJI COUNT COMPONENT ========================================
class EmojiCount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emojiCount: 0,
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="emoji-count">
          {this.props.emojiCount}
        </div>
      </React.Fragment>
    )
  }
}

// LEFT PANEL ========================================
class Channels extends React.Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    
    this.state = {
      changeUserDetailsBool: false,
      currentChannelid: props.currentChannelid,
      channelList: [],
      
    }
    
    this.createChannel = this.createChannel.bind(this);
    this.showCurrentChannel = this.showCurrentChannel.bind(this);

  
    // this.listAllChannels = this.listAllChannels.bind(this);


  }

  // listAllChannels() {
  //   const data = fetch('/api/listchannels',
  //   {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
  //     },
  //   }
  // )
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log('List CHannels: ', data);
  //     this.setState({ channelList: data })
  //     // error handling
  //     if (data.error) {
  //       console.log("error", data.error)
  //       this.changeURL("/")
  //       history.pushState({}, '', '/');
  //     }
  //     if (data.length > 0) {
  //       if (this.state.currentChannelid === null) {
  //         this.props.updatecurrentChannelid(data[0].uuid);
  //       }
  //       else {
  //         this.props.updatecurrentChannelid(this.state.currentChannelid);
  //       }

  //     }
  //   }
  //   )
  // }

  // componentDidMount() {
  //   this.listAllChannels();
  // }

  showCurrentChannel(uuid) {
    // show current channel uuid
    console.log("674---channels is updating current channel from:", this.state.currentChannelid);
    this.props.updatecurrentChannelid(uuid);
    // if (this.props.changeWindowSizesNums){
      //   console.log("changing window size to 2 865")
      //   this.props.changeWindowSizesNums(2);
      // }
    console.log("676---channels is updating current channel to:", this.state.currentChannelid);
    
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentChannelid !== this.props.currentChannelid) {
      this.setState({
        currentChannelid: this.props.currentChannelid
      })
    }
    
    if (this.state.channelList !== this.props.channelList) {
      this.setState({
        channelList: this.props.channelList
      })
    }
    
  }

  logOut() {
    console.log("logging out")
    // this.props.changeURL("/");
    this.props.logOutUser();
    // this.props.updatecurrentChannelid(null);
    // this.props.updatecurrentChannelid(null);
    // window.localStorage.removeItem("divyapattisapu_belay_auth_key");
    // history.pushState("/login", "Login", "/login");
    // change the login state to loggedin=false

  }
  
  createChannel() {
    console.log("creating channel")

    // get the data from add-channel-textarea
    let new_channelName = document.querySelector(".add-channel-textarea").value;

    const data = fetch('/api/create_channel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
      },
      body: JSON.stringify({ "name": new_channelName }),
    })

      .then(response => response.json())
      .then(data => {
        console.log('Success 759:', data);

        this.props.updateChannelList(data);
      }
      )
  }



  render() {
    // const { channelList } = this.props;


    // console.log("---render channels", channelList)
    console.log("---render channels", this.state.currentChannelid)

    return (
      <React.Fragment>
        <div className="channels">
          <div id="workspace-name"  >Workspace</div>
          {this.state.channelList && this.state.channelList.map((channel) => <Channel key={channel.uuid} uuid={channel.uuid} name={channel.name} showCurrentChannel={this.showCurrentChannel} currentChannelid={this.state.currentChannelid} changeURL={this.props.changeURL} updatecurrentChannelid={this.props.updatecurrentChannelid} changeWindowSizesNums={this.props.changeWindowSizesNums} />)}
          <div id="add-channel-container">
            <div id="plus"><span>+</span></div>
            <div id="add-channel" onClick={this.createChannel}>Add Channel</div>
            <textarea className="add-channel-textarea" placeholder="Add Channel"></textarea>
          </div>
          <button id="logout" onClick={
            () => {
              this.logOut();
            }
          }>Log Out</button>

          <div className="change-user-details">
            <button id="change-user-details-button" onClick={() => {
              this.props.changeUserDetails();
            }}>Change User Details</button>
          </div>
        </div>

      </React.Fragment>
    );
  }
}



// CHANNEL COMPONENT ========================================
// Child component of Channels 
class Channel extends React.Component {
  constructor(props) {
    super(props);
    // console.log("------channel constructor", props)
    this.state = {
      uuid: props.uuid,
      name: props.name,
      active: false,
      currentChannelid: props.currentChannelid
    };
    this.makeActive = this.makeActive.bind(this);

    // check if current channel is active
    if (this.state.currentChannelid === this.state.uuid) {
      this.state.active = true;
    } else {
      this.state.active = false;
    }
  }

  componentDidMount() {
    // // console.log("------channel did mount")

  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.currentChannelid !== this.props.currentChannelid) {
      //   this.setState({ currentChannelid: this.props.currentChannelid });
      
      // which variable is changing?
      if (prevProps.currentChannelid !== this.props.currentChannelid) {

        console.log("------channel did update", this.state.active, this.state.currentChannelid , this.state.uuid)
        if (this.props.currentChannelid !== this.state.uuid) {
          this.setState({ active: false });
        }
        else{
          this.setState({ active: true });
        }
        this.setState({ currentChannelid: this.props.currentChannelid });
      }
    // }

    // if (prevState.currentChannelid !== this.state.currentChannelid) {
    //   // console.log("------channel did update", this.state.active)
    //   if (this.state.currentChannelid === this.state.uuid) {
    //     this.setState({ active: true });
    //   } else {
    //     this.setState({ active: false });
    //   }
    // }


    // if (prevProps.uuid !== this.props.uuid) {
    //   this.setState({ uuid: this.props.uuid });
    // }
    // // console.log("------channel did update", this.state.active)
    // if (prevProps.currentChannelid !== this.props.currentChannelid) {
    //   // console.log("------channel did update", this.state.active)
    //   if (this.props.currentChannelid === this.state.uuid) {
    //     this.setState({ active: true });
    //   } else {
    //     this.setState({ active: false });
    //   }
    // }
  }


  makeActive() {
    // // console.log("------make active", this.state.uuid)
    this.setState({ active: true });

    
    // send channel name to parent component
    // how to send channel name to parent component?
    // this.props.showActiveChannel(this.state.name);  
    // console.log("------make active", this.state.uuid)
    // send channel name to parent component
    // this.props.showCurrentChannel(this.state.uuid);
    this.props.updatecurrentChannelid(this.state.uuid);
    this.props.changeURL("/channel/" + this.state.uuid)

    if (this.props.changeWindowSizesNums) {
      console.log("changing window size to 2 865")
      this.props.changeWindowSizesNums(2);
    }
    // change color of channel


  }


  render() {
    // if (this.state.active) {
    //   // history.pushState({}, "", "/channels/" + this.state.uuid);
    // }

    let channel = <div className={`channel${this.state.active ? " active" : ""}`} onClick={this.makeActive} >
      <div className="hash">#</div>
      <div className="channel-name">{this.state.name}</div>
    </div>

    // console.log("------channel render", channel)

    return channel;
  }
}


// CENTER PANEL ========================================
class Center extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentChannelid: props.currentChannelid,
    };
  }


  componentDidUpdate(prevProps, prevState) {
    
    // if (prevProps.currentChannelid !== this.props.currentChannelid) {
    //   console.log("---componentDidUpdate", this.props.currentChannelid)
    //   this.setState({ currentChannelid: this.props.currentChannelid });
    // }

    if (this.props.currentChannelid !== this.state.currentChannelid) {
      console.log("---componentDidUpdate", this.props.currentChannelid)
      this.setState({ currentChannelid: this.props.currentChannelid });
    }
  }

  render() {
    // // console.log("---render center")
    // const { currentChannelid } = this.props;
    const { styles } = this.props;
    console.log("812---currentChannelid", this.state.currentChannelid)
    return <React.Fragment>
      <Messages styles={styles} currentChannelid={this.state.currentChannelid} displayThreads={this.props.displayThreads} changeURL={this.props.changeURL} changeWindowSizesNums={this.props.changeWindowSizesNums} />
    </React.Fragment>
  }
}



// // CENTER PANEL2 ========================================
// class Center2 extends React.Component {
//   constructor(props) {
//     super(props);
//     // // console.log("---center constructor", props.currentChannelid)
//   }


//   componentDidUpdate(prevProps) {
//     // // console.log("---componentDidUpdate")

//     if (prevProps.currentChannelid !== this.props.currentChannelid) {
//       this.setState({ currentChannelid: this.props.currentChannelid });
//     }
//   }

//   render() {
//     // // console.log("---render center")
//     const { currentChannelid } = this.props;
//     // // console.log("---currentChannelid", currentChannelid)
//     return <React.Fragment>
//       <Messages currentChannelid={currentChannelid} displayThreads={this.props.displayThreads} />
//     </React.Fragment>
//   }
// }


// MESSAGES ========================================
class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageList: null,
      replyCountList: null,
      currentChannelid: props.currentChannelid,
      interval: null,
      interval2: null,
    }

    this.getMessages = this.getMessages.bind(this);
    this.getReplyCount = this.getReplyCount.bind(this);

  }

  componentDidMount() {
    // console.log("messages did mount")

    const interval = setInterval(this.getMessages, 100);
    const interval2 = setInterval(this.getReplyCount, 100);

    this.setState({ interval: interval });
    this.setState({ interval2: interval2 });

    // const i = setInterval(this.getChannels, 500);

  }

  componentDidUpdate(prevProps) {
    // if (prevProps.currentChannelid !== this.props.currentChannelid) {
    //   this.getMessages();
    // }

    if (this.state.currentChannelid !== this.props.currentChannelid) {
      this.setState({ currentChannelid: this.props.currentChannelid });
    }
  }

  // is this object mounted?
  componentWillUnmount() {
    // console.log("messages will unmount")
    clearInterval(this.state.interval);
    clearInterval(this.state.interval2);
  }



  getReplyCount() {
    // console.log("get reply count")
    // make an api call to the list of messages from the current channel
    const data = fetch('/api/replycount/' + this.state.currentChannelid,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
        }
      })
      .then(response => response.json())
      .then(data => {
        // console.log('=======REPLIES:', data);
        this.setState({ replyCountList: data })
      }
      )
    // .then(() => {
    //   // // console.log("replyCountList :", this.state.replyCountList)
    // })
  }


  getMessages() {
    // console.log("get messages")
    if (this.state && this.state.currentChannelid) {
      // make an api call to the list of messages from the current channel
      const data = fetch('/api/listmessages/' + this.state.currentChannelid,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
          },
        }
      )
        .then(response => response.json())
        .then(data => {
          // console.log('=======DATA:', data);
          this.setState({ messageList: data })
        }
        )
        .then(() => {
          // // console.log("messages did update", this.state.messageList)
        })
    }
  }



  // updateEverySecond() {
  //   setInterval(() => {
  //     this.getMessages();
  //   }, 100);
  // }

  postMessage() {
    // console.log("post message")
    // make an api call to post a message to the current channel
    if (this.state && this.state.currentChannelid) {
      const data = fetch('/api/postmessages/' + this.state.currentChannelid,
        {
          method: 'POST',
          body: JSON.stringify({
            body: document.getElementById("post_message_here").value
          }),
          headers: {
            'Content-Type': 'application/json',
            'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
          }
        }
      )
        .then(response => response.json())
        .then(data => {
          // console.log('Success:', data);
          // this.setState({ messageList: data })
          this.getMessages();
        }
        )
        .then(() => {
          // console.log("messages did post", this.state.messageList)
          const tb = document.getElementById("post_message_here");
          tb.value = "";
        })
    }
  }


  render() {

    const { messageList, replyCountList } = this.state;

    // // console.log("replyCountList :", this.state.replyCountList)
    // // console.log("render messages from channel", currentChannelid)


    // combine messageList and replyCountList

    if (messageList && replyCountList) {
      messageList.forEach((message) => {
        replyCountList.forEach((replyCount) => {
          if (message.id === replyCount.reply_to) {
            message.reply_count = replyCount.count;
          }
        })
      })
    }


    // // console.log("MessageReplyCount :", this.state.messageList)
    return <div className="center-panel" styles={this.props.styles}>
      <div className="messages">
        {messageList && messageList.map((message) => {
          return <React.Fragment key={message.id} >
            <Message key={message.id} uuid={message.id} name={message.name} user_id={message.user_id} channel_id={message.channel_id} body={message.body} reply_count={message.reply_count} displayThreads={this.props.displayThreads} changeURL={this.props.changeURL} changeWindowSizesNums={this.changeWindowSizesNums} />
            <Emoji />
          </React.Fragment>
        })}
      </div>

      <div className="comment_box">
        <textarea name="comment" id="post_message_here"></textarea>
        <button type="submit" value="Post" onClick={() => this.postMessage()}>Post</button>
      </div>
    </div>
  }
}


class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: props.uuid,
      name: props.name,
      // user_id: props.user_id,
      // channel_id: props.channel_id,
      body: props.body,
      reply_count: props.reply_count,
      replyList: null,
      currentChannelid: props.currentChannelid,
    };

    this.loadThreads = this.loadThreads.bind(this);

  }

  loadThreads() {
    // console.log("load threads")
    console.log("channel_id :", this.state.channel_id)
    // make an api call to the list of messages from the current channel

    this.props.changeURL("/channel/" + this.state.channel_id + "/thread/" + this.state.uuid)

    const data = fetch('/api/listreplies/' + this.state.channel_id + '/' + this.state.uuid,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
        },
      }
    )
      .then(response => response.json())
      .then(data => {
        // console.log('=362======REPLY BODY:', data);
        this.props.displayThreads(data, this.state.uuid, this.state.user_id, this.state.body, this.props.name);

      }
      )
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("message did update")

    if (this.state.uuid !== prevState.uuid) {
      this.setState({ uuid: this.props.uuid })
    }

    if (this.state.name !== prevState.name) {
      this.setState({ name: this.props.name })
    }

    if (this.state.body !== prevState.body) {
      this.setState({ body: this.props.body })
    }

    if (this.state.reply_count !== prevState.reply_count) {
      this.setState({ reply_count: this.props.reply_count })
    }

    if (this.state.channel_id !== this.props.channel_id) {
      this.setState({ channel_id: this.props.channel_id })
    }
  }

  render() {
    let replies_text = "replies";
    if (!this.props.reply_count || this.props.reply_count === 0 || this.props.reply_count === null) {
      replies_text = "Click to reply";
    }
    // // console.log("render message")
    return <div className="message">
      <div className="author">{this.props.name}</div>
      <div className="message-text">{this.props.body}</div>
      <div className="panel-reply" onClick={() => {
        // console.log("click reply panel")
        console.log("channel_id :", this.state.channel_id)
        this.loadThreads()
      }}>
        {<a href="javascript:void(0);" className="reply-count">{this.props.reply_count} {replies_text}</a>}
      </div>
    </div>
  }
}


// REPLY PANEL ========================================

// class ReplyPanel extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const { reply_count } = this.props;
//     const { replyPanePresent, closeThreads, displayThreads } = this.props;
//     // // console.log("render reply panel", reply_count)
//     // console.log("render reply panel", replyPanePresent, reply_count)
//     if (this.props.reply_count > -1) {
//       return (
//         <div className="panel-reply" onClick={() => displayThreads()}>
//           <a href="#" className="reply-count">{this.props.reply_count} replies</a>
//         </div>
//       )
//     }
//     else {
//       return null;
//     }
//   }
// }

// RIGHT PANEL ========================================

class RightPanel extends React.Component {
  constructor(props) {
    super(props);
    // console.log("right panel props", props)

    this.state = {
      closeButtonFn: props.closeButtonFn,
      replyPanePresent: props.replyPanePresent,
      replyList: props.replyList,
      name: props.name,
      body: props.body,
      user_id: props.user_id,
      // channel_id : props.channel_id,
      currentChannelid: props.currentChannelid,
      uuid: props.uuid,
      // reply_count : props.reply_count
    }

    // console.log("LINE 489 replyList", this.state.replyList)
    console.log("uuid, user_id, body, name", this.state.uuid, this.state.user_id, this.state.body, this.state.name)

    this.getReplies = this.getReplies.bind(this);
    this.postReply = this.postReply.bind(this);
    this.updateStatesFirstMessage = this.updateStatesFirstMessage.bind(this);
    // this.fetchFirstMessage = this.fetchFirstMessage.bind(this);

  }


  updateStatesFirstMessage(data) {
    console.log("fetch first message", data)

    this.setState({
      name: data.name,
      body: data.body,
      user_id: data.user_id,
      uuid: data.uuid,
    })

    console.log("name, body,", this.state.name, this.state.body)
  }


  componentDidMount() {
    const interval_get_replies = setInterval(this.getReplies, 100)

    // check if name, body, user_id, channel_id are mounted



    // if (!this.state.name || !this.state.body || !this.state.user_id || !this.state.body || !this.state.channel_id ) {
    // if (!this.state.name || !this.state.body || !this.state.user_id || !this.state.body || !this.state.channel_id) {

    console.log("NO PROPS")
    const data = fetch('/api/thread/' + this.state.uuid,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
        },
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log("1453 data", data)
        this.updateStatesFirstMessage(data)
      })

    // }
    // else{
    //   console.log("PROPS");
    //   this.setState({
    //     name: this.props.name,
    //     body: this.props.body,
    //     user_id: this.props.user_id
    //   })

    // }

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.replyPanePresent !== this.props.replyPanePresent) {
      this.setState({
        replyPanePresent: this.props.replyPanePresent,
      });
    }

    if (this.state.uuid !== this.props.uuid && this.props.uuid !== null && this.props.uuid !== undefined) {
      this.setState({
        uuid: this.props.uuid,
      });
      console.log("NO PROPS")
      const data = fetch('/api/thread/' + this.props.uuid,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
          },
        }
      )
        .then(response => response.json())
        .then(data => {
          console.log("1453 data", data)
          this.updateStatesFirstMessage(data)
        })
    }

    if (this.state.name !== this.props.name && this.props.name !== null && this.props.name !== undefined) {
      this.setState({
        name: this.props.name,
      });
    }

    if (this.state.body !== this.props.body && this.props.body !== null && this.props.body !== undefined) {
      this.setState({
        body: this.props.body,
      });
    }

    // if (this.state.body !== prevState.body) {
    //   this.setState({
    //     body: this.props.body,
    //   });
    // }



    // if (this.state.user_id !== this.props.user_id) {
    //   this.setState({
    //     user_id: this.props.user_id,
    //   });
    // }


    // if (this.state.uuid !== prevState.uuid) {
    //   console.log("NO PROPS")
    //   const data = fetch('/api/thread/' + this.props.uuid,
    //     {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
    //       },
    //     }
    //   )
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log("1453 data", data)
    //       this.updateStatesFirstMessage(data)
    //     })
    // }


    // if (this.state.name !== prevState.name ) {
    //   this.setState({
    //     name: this.props.name,
    //   });
    // }

    // if (this.state.body !== prevState.body ) {
    //   this.setState({
    //     body: this.props.body,
    //   });
    // }

    // if (this.state.user_id !== prevState.user_id ) {
    //   this.setState({
    //     user_id: this.props.user_id,
    //   });
    // }


    // if (this.state.uuid !== this.props.uuid) {
    //   this.setState({
    //     uuid: this.props.uuid,
    //   });
    // }



  }

  getReplies() {
    console.log("get replies")
    if (this.props && this.props.channel_id && this.props.uuid !== null) {
      fetch('/api/listreplies/' + this.props.channel_id + '/' + this.props.uuid,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
          },
        }
      )

        .then(response => response.json())
        .then(data => {
          console.log('=362======REPLY BODY:', data);
          this.setState({
            replyList: data
          })
          console.log("replyList", this.state.replyList)
        }
        )


    }
  }

  postReply() {
    // console.log("post reply")
    if (this.props && this.props.channel_id && this.props.uuid !== null) {
      fetch('/api/postreply/' + this.props.channel_id + '/' + this.props.uuid, {
        method: 'POST',
        body: JSON.stringify({
          user_id: this.props.user_id,
          body: document.querySelector("#post_reply_here").value
        }),
        headers: {
          'Content-Type': 'application/json',
          'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('540======REPLY BODY:', data);
          // this.setState({
          //   // replyList: data
          // })
        })
    }
  }


  render() {
    // if (this.state.replyPanePresent === false)
    //   return null;
    const { closeButtonFn, replyPanePresent, replyList } = this.state;
    // console.log("right panel render", this.state.replyList)
    // console.log("-===========right panel render", replyList)
    // history.pushState({},"", "/channel/" + this.props.channel_id + "/" + this.props.uuid)
    return (
      <div className="right-panel">
        <div id="threadHeader">
          <p id="replies">Replies</p>
          <button className="close" onClick={this.state.closeButtonFn}>X</button>
        </div>
        <div className="main-message">
          <Message key={this.state.uuid} name={this.state.name} uuid={this.state.uuid} user_id={this.state.user_id} body={this.state.body} />
        </div>
        <div className="messages">
          {console.log("571==========================replyList", this.state.replyList)}
          {this.state.replyList && this.state.replyList.map((message) => {
            console.log("573==========================message", message)
            return < Message key={message.id} uuid={message.id} name={message.name} user_id={message.user_id} channel_id={message.channel_id} body={message.body} reply_count={message.reply_count} displayThreads={this.props.displayThreads} />
            // return <Message key={message.id} uuid={message.id} user_id={message.user_id} channel_id={message.channel_id} body={message.body} reply_count={message.reply_count} displayThreads={this.props.displayThreads} />
          }
          )}
        </div>
        <div className="comment_box">
          <textarea name="comment" id="post_reply_here"></textarea>
          <button type="submit" value="Post" onClick={() => this.postReply()}>Post</button>
        </div>

      </div>
    )
  }
}

// CHANGE USER NAME AND PASSWORD FOR LOGGEDIN USERS
class ChangeUserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      user_id: '',
      api_key: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.returnToHome = this.returnToHome.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  returnToHome() {
    this.props.displayHome()
  }

  changeUserName() {
    console.log("change user name")
    console.log("change user name", document.getElementById("change_user_name").value)

    if (this.props && this.props.user_id !== null) {
      fetch('/api/users/changename', {
        method: 'POST',
        body: JSON.stringify({
          name: document.getElementById("change_user_name").value
        }),
        headers: {
          'Content-Type': 'application/json',
          'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
        }
      })

        .then(response => response.json())
        .then(data => {
          console.log('=362======REPLY BODY:', data);
          // this.setState({
          //   replyList: data
          // })
        })
        .then(() => {
          // console.log("replyList", this.state.replyList)
        }
        )
    }
  }


  changeUserPassword() {
    console.log("change user password")
    if (this.props && this.props.user_id !== null) {
      fetch('/api/users/changepassword', {
        method: 'POST',
        body: JSON.stringify({
          password: document.getElementById("change_user_password").value
        }),
        headers: {
          'Content-Type': 'application/json',
          'api_key': window.localStorage.getItem("divyapattisapu_belay_auth_key")
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('=362======REPLY BODY:', data);
          // this.setState({
          //   replyList: data
          // })
        })
        .then(() => {
          // console.log("replyList", this.state.replyList)
          this.returnToHome()
        }
        )
    }
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="change-user-details">
        <form onSubmit={this.handleSubmit}>
          <label>
            Change User Name:
            <input type="text" name="name" id="change_user_name" value={this.state.name} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" onClick={() => this.changeUserName()} />
        </form>
        <form onSubmit={this.handleSubmit}>
          <label>
            Change User Password:
            <input type="text" name="password" id="change_user_password" value={this.state.password} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" onClick={() => this.changeUserPassword()} />
        </form>

        <button onClick={
          () => {
            // return to "" page
            this.returnToHome()
          }
        }> Return </button>
      </div>
    )
  }
}



// ========================================

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
