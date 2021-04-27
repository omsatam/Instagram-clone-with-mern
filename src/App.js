import './App.css';
import Post from "./Post";
import React, {useState, useEffect} from "react";
import {db, auth} from "./firebase"
import {Button, Input, makeStyles} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import ImageUpload from "./ImageUpload"
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;
  
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts,setPosts] = useState([])
  const classes = useStyles();
  const [open, setOpen] = useState(false)
  const[openSignIn, setOpenSignIn] = useState(false)
  const [modalStyle] = useState(getModalStyle);
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [email,setEmail] = useState("")
  const [user, setUser] = useState(null);

  useEffect(() => {
     const unsubscribe = auth.onAuthStateChanged((authUser)=> {
        if(authUser){
            //user has logged in...
            console.log(authUser);
            setUser(authUser);
        }

        else{
          //user has logged out
          setUser(null)
        }
      })
      return () => {
        //perform cleanup actions
        unsubscribe();
      }
  }, [user,username])
 
  useEffect(() => {
    db.collection("posts").orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id:doc.id,
        post: doc.data()})))
    })
  }, [])

  const signUp = (event) =>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      setUser(authUser)
      return authUser.user.updateProfile({displayName:username})
    })
    .catch((error)=> alert(error.message))
    setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch(error => alert(error.message))
    setOpenSignIn(false)
  }

  return (
    <div className="app">
      
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >   
       <div style={modalStyle} className={classes.paper}>
         <form className="app__signup">
         <center>
         <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
      alt="instagram logo" 
      className="app__headerImage"/>
      
       </center>
       <Input
      placeholder="username"
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      />
      <Input
      placeholder="email"
      type="text"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      />
       <Input
      placeholder="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      />
       <Button onClick={signUp}>Sign Up </Button>
       </form>
        </div>
      </Modal>


      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >   
       <div style={modalStyle} className={classes.paper}>
         <form className="app__signup">
         <center>
         <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
      alt="instagram logo" 
      className="app__headerImage"/>
      
       </center>
      <Input
      placeholder="email"
      type="text"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      />
       <Input
      placeholder="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      />
       <Button onClick={signIn}>Sign In </Button>
       </form>
        </div>
      </Modal>


      <div className="app__header">
      {/* header */}
      <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
      alt="instagram logo" 
      className="app__headerImage"/>
      {user ? ( <Button onClick={() => auth.signOut()}>Logout</Button>)
      : ( <div className="app__loginContainer">
      <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
      <Button onClick={() => setOpen(true)}>Sign Up</Button>
      </div>)
      }
      </div>
     
      <div className="app__posts">
      {posts.map(({id,post}) => (
        //because of key it refreshes just newly added post
        <Post key={id} postId={id} user={user} username={post.username} u caption={post.caption} imageUrl={post.imageUrl}/>
      ))
      }
  </div>
      <InstagramEmbed
        url='https://www.instagram.com/p/CAZW9AIH5bT/'
        // clientAccessToken='123|456'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />

{(user?.displayName) ? (<ImageUpload username={user.displayName}/>) : <h3 style={{textAlign : "center"}}>Please login to upload posts</h3> }
     
    </div>
  );
}

export default App;
