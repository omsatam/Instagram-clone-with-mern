import React,{useState, useEffect} from 'react'
import "./Post.css";
import Avatar from "@material-ui/core/Avatar"
import {db } from "./firebase"
import firebase from "firebase"

function Post({postId, username, user, caption, imageUrl}) {
    const[comments, setComments] = useState([]);
    const[comment,setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if (postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp","desc")
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map(
                    (doc) => doc.data()
                ));
            });
        }
        return () => {
          unsubscribe();
        }
    }, [postId])

        const postComment = (event) => {
            event.preventDefault();

            db.collection("posts").doc(postId).collection("comments").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
                comment: comment
            });
            setComment("")
        }
        console.log(comments)

    return (
        <div className="post">
            {/* header : avatar + username */}
            <div className="post__header">
            <Avatar
            className="post__avatar"
            alt={username}
             src="/static/1.png"
            />
            <h3>{username}</h3>
            </div>
            {/* image */}
            <img src={imageUrl}
             alt="post" 
             className="post__image"/>
            {/* username + caption */}
            <h4 className="post__text"><strong>{username}: </strong>{caption}</h4>
           {
            <div className="post__comments"> 
            { comments.map((comment) => (
                    <p>
                        <strong>{comment.username}: </strong>{comment.comment}
                    </p>
            ))}              
        </div>
        }

            {user && (
                <form  className="post__commentBox">
                <input
                className="post__input"
                type="text"
                value={comment}
                placeholder="Add a comment.."
                onChange={(e) => setComment(e.target.value)}
                />
                <button
                disabled={!comment}
                className="post__button"
                type="submit"
                onClick={postComment}>
                    Post
                </button>
            </form>
            )}
            
        </div>
    )
}

export default Post
