# LinkedIn API Details :

## AuthRoute :

- `/login`
- `/signUp`
- `/logout`

## userRoute :

- `/user/suggestedUser` - EdgeCase : It should not be in connections
- `/user/Profile/view`
- `/user/Profile/edit`
- `/user/publicProfile/:id`

## postRoute :

- `/post/feedPost`

* `/post/getPost/:userId `- get the loggedIn User post
* `/post/createPost` - const { content, visibility } = req.body; // visibility can be 'public' or 'private'

* `/post/updatePost/:postId` - **EdgeCase** - here we are checking loggedIn user === author is equal then only allow you to edit----
* `/post/deletePost/:postId` -**EdgeCase** - here we are checking loggedIn user === author is equal then only allow you to delete----

* `/post/like/:postId` - here we need get the userId from req.user ,and add the userId into the Like Array[],here we need create a notificationSchema,here we post owner is a receiverId using that we need to send the notification
* `/post/unlike/:postId` - here we need get the userId from req.user ,and remove the userId from the Like Array[]

## commentRoute :

- `/comment/create/:postId` - get the receiverId from postId which is passed a req.params using that send the notification,here sender Id we will get from the req.user
- `/comment/getAll/:postId`
- `/comment/delete/:postId/:commentID` - **EdgeCase** : here we are only allow comment owner can delete the comment
- `/comment/edit/:postId/:commentID` - **EdgeCase** : here we are only allow comment owner can edit the comment

## connectionRoute :

- `/connections/getAll` - In the userSchema we have connection array just we need to populate it // check the valid id or not

- `/connection/send/:receiverId` - here we will take the senderId from req.user to create a connectionSchema
  - check receiver id is exist in the database or not,IF it is not send Error - user not found
  - check the whether user is already in the connection if it is throw error already in the connection
  - user can't send the connection by himself if it is throw Error
  - create a new connection schema update the status as pending and send the notification to receiver
- `/connection/accepted/:connectionId` - once receiver accepted the request we need to add the sendID in to receiver userConnection
  - check the connectionId is valid or not
  - check the loggedIn user id is equal to the receiverID and status should be pending
  - find the connectionId change the status as accepted
  - Add the senderId to receiverId connection vise verse $addToSet
  - create a notification schema
- `/connection/rejected/:connectionId` - if receiver rejected , we shouldn't show the receiver profile to sender as a suggested user

  - check the connectionId is valid or not
  - find the connection using above connectionID
  - check the loggedIn user id is equal to the receiverID and status should be pending
  - change the status as rejected

  - `/connection/review` - Review the pending Connection

## notificationRoute :

- `/notification/get` - req.user using that we will get the userId based on that using find method we can get all the notification for the specific user
- `/notification/delete/:notificationId` - here we need check relatedField is equal to loggedIn user then we deleted the notification
- `/notification/readStatus/:notificationId` - readStatus Could be read or unRead ,it's a boolean we can handle it ,here also we will get the userId from req.user

<hr>

# Stack Details (justification):

## frontEnd :

- **`ReactJs`**
- **`ReactQuery`** (`Advantage :` It is easily bind with server side , if any updation anyone made , we can trigger fetch automatically ,based key which we providing in react query using that react query will keep track of it,Additionally we can easily handle the over fetching, we can easily handle like,comment,connection like real time update )
- **`React Hook Form`** - (`Advantage :`using the we can easily validated the form and Additionally it reduce the unwanted rendering , when we using the useState to get the input value ,each n and every key press it will render , that we can easily handle by react Hook form and also we can show Error efficiently,)
- **`React Router Dom`** - (`Advantage :`Without Re-loading our whole page , we can easily navigate from one page to another page)
- **`TailwindCss`** -(`Advantage :`Using Tailwind CSS in React allows for fast, utility-first styling with minimal custom CSS, enabling a more efficient, responsive, and maintainable design workflow)
- **`Axios`** - (`Advantage :` Axios simplifies making HTTP requests in JavaScript by providing a clean, promise-based API with built-in support for handling requests, responses, and errors,Additionally we can create a instance using that we can make a API call though that we can AVoid of writing the full path again n again)

## Backend :

- **`ExpressJs`** - (`Advantage :` ExpressJs use Libuv,event-loop and threadPool to handle the multiple Request Efficiently ,Express.js provides a lightweight, flexible, and fast framework for building scalable web applications and APIs with minimal setup and robust middleware support)

- **`Mongoose`** - (`Advantage :` Mongoose simplifies MongoDB interactions by providing a powerful schema-based solution for data validation, modeling, and querying in Node.js applications)
