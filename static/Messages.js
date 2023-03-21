class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            author: props.name,
            message: props.message
          };
        }
      render() {
            return <h1>JUST PLEASE UPDATE SOMETHING</h1>
        //   return <div className="message">
        //     <div className="author">{this.state.author}</div>
        //     <div className="message-text">{this.state.message}</div>
        //     </div>
      }
  }
           

  export default Messages;