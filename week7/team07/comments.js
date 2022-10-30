/*
A getAllComments and renderCommentList method.
A comment type to use as a key.
A filterCommentsByName method.
An array to hold all of our comments.
A comment should look something like this:
const newComment = {
      name: hikeName,
      date: new Date(),
      content: comment
    };
    A method to add an event listener to the submit button.
An addComment method
*/

//added commentModel from the instructor solution to practice MVC
class CommentsModel {
    constructor(type) {
        this.type = type;
        //more compact than an if statement checking the state of readFromLS
        this.comments = readFromLS(this.type) || [];
    }

    getAllComments(){
        return this.comments;
    }

    filterCommentsByName(name){
        return this.comments.filter(item => item.name === name);
    }

    addComment(hikeName, comment){
        const newComment = {
            name: hikeName,
            date: new Date().toDateString(),
            content: comment
        };
        this.comments.push(newComment);
        writeToLS(this.type, this.comments);
    }

}

function writeToLS(key, data){
    window.localStorage.setItem(key, JSON.stringify(data));
}

function readFromLS(key){
    return JSON.parse(window.localStorage.getItem(key));
}

export default class Comments {
    constructor(type, commentsFieldId) {
        this.type = type;
        this.parentId = commentsFieldId;
        this.model = new CommentsModel(this.type);
    }

    showCommentsList(name = null) {
        console.log('showing comment list from comments class')
        const id = this.parentId;
        const parentElement = document.getElementById(id);
        parentElement.innerHTML = '';
        if (name !== null) {
            parentElement.appendChild(this.showCommentsForm());
            this.commentButtonListener(name);
        }
        let comments = this.model.filterCommentsByName(name);
        
        if (comments === null) {
            comments = this.model.getAllComments();
            renderCommentList(parentElement,comments);
            return
        }
        
        renderCommentList(parentElement,comments);
    }
    
    showCommentsForm() {
        //displays the form for entering a comment
        const parent = document.createElement('li');
        const commentForm =  `<input type="text" id="comment-input" placeholder="Add comment here"><button id="addComment">Submit</button>`;
        parent.innerHTML = commentForm;
        return parent;
    }

    commentButtonListener(name) {
        document.getElementById('addComment').ontouchend = () => {
            this.model.addComment(
                name,
                document.getElementById('comment-input').value
            );
            document.getElementById('comment-input').value = '';
            this.showCommentsList(name);
        }

    }
} // end of comments class

function renderCommentList(parent, comments) {
        comments.forEach(comment => {
            parent.appendChild(renderOneComment(comment));
        });
}

function renderOneComment(comment) {
    const item = document.createElement('li');
    const date = comment.date;
    item.innerHTML = `
    <div class="commentTitle">${comment.name} <span>${date}</span></div>
    <div>${comment.content}</div>
    `;

    return item;
}