{
  "firstName": "John",
  "lastName": "Doe",
  "userName": "johndoe001",
  "email": "johndoe001@example.com",
  "password": "TestPassword123!",
  "dateOfBirth": "2003-05-15",
  "bio": "Testing PingUp"
}

{
    "success": true,
    "message": "Cover picture updated successfully",
    "user": {
        "profilePicture": {
            "url": "https://res.cloudinary.com/doc865ug6/image/upload/v1788506772/uwx1maucxxj1tjhvzfbp.jpg",
            "publicId": "uwx1maucxxj1tjhvzfbp"
        },
        "coverPicture": {
            "url": "https://res.cloudinary.com/doc865ug6/image/upload/v1788506987/shzg4j9xvfh4lvemtmqk.jpg",
            "publicId": "shzg4j9xvfh4lvemtmqk"
        },
        "_id": "6a9a25e923b88b2b0939c903",
        "firstName": "John",
        "lastName": "Doe",
        "password": "$2b$10$E4DSSYcrPsccxoV2UfiyUOq.cfKk51mHQ28u3d7.PtWKrjG0MYyUW",
        "userName": "johndoe001",
        "email": "johndoe001@example.com",
        "dateOfBirth": "2003-05-15T00:00:00.000Z",
        "bio": null,
        "isOnline": false,
        "lastSeen": null,
        "following": [],
        "followers": [],
        "createdAt": "2026-09-04T01:59:05.714Z",
        "updatedAt": "2026-09-04T07:29:47.780Z",
        "__v": 0
    }
}



{
    "success": true,
    "message": "Profile updated successfully",
    "user": {
        "profilePicture": {
            "url": "https://res.cloudinary.com/doc865ug6/image/upload/v1788506772/uwx1maucxxj1tjhvzfbp.jpg",
            "publicId": "uwx1maucxxj1tjhvzfbp"
        },
        "coverPicture": {
            "url": "https://res.cloudinary.com/doc865ug6/image/upload/v1788506987/shzg4j9xvfh4lvemtmqk.jpg",
            "publicId": "shzg4j9xvfh4lvemtmqk"
        },
        "_id": "6a9a25e923b88b2b0939c903",
        "firstName": "John",
        "lastName": "Smith",
        "userName": "johnsmith001",
        "email": "johndoe001@example.com",
        "dateOfBirth": "2003-05-15T00:00:00.000Z",
        "bio": "Computer Science student and aspiring full-stack developer building real-world applications.",
        "isOnline": false,
        "lastSeen": null,
        "following": [],
        "followers": [],
        "createdAt": "2026-09-04T01:59:05.714Z",
        "updatedAt": "2026-09-04T07:34:39.202Z",
        "__v": 0
    }
}


{
    "success": true,
    "message": "getting post success",
    "posts": [
        {
            "_id": "6a9a9bfc554b94a88b052095",
            "author": "6a9a25e923b88b2b0939c903",
            "content": "Consistency beats motivation. One feature at a time, one bug at a time. 💻🔥",
            "image": [],
            "likes": [],
            "comments": [],
            "createdAt": "2026-09-04T10:22:52.908Z",
            "updatedAt": "2026-09-04T10:22:52.908Z",
            "__v": 0
        },
        {
            "_id": "6a9ab1fc6133a6fb9bb95934",
            "author": "6a9a25e923b88b2b0939c903",
            "content": null,
            "image": [
                {
                    "url": "https://res.cloudinary.com/doc865ug6/image/upload/v1788523004/eys9bw8wz39f2rwxxica.jpg",
                    "publicId": "eys9bw8wz39f2rwxxica",
                    "_id": "6a9ab1fc6133a6fb9bb95935"
                }
            ],
            "likes": [],
            "comments": [],
            "createdAt": "2026-09-04T11:56:44.268Z",
            "updatedAt": "2026-09-04T11:56:44.268Z",
            "__v": 0
        },
        {
            "_id": "6a9ab4346133a6fb9bb95936",
            "author": "6a9a25e923b88b2b0939c903",
            "content": "Some cars get you there. BMW makes the journey unforgettable",
            "image": [
                {
                    "url": "https://res.cloudinary.com/doc865ug6/image/upload/v1788523572/hulyvgcro7avwuywx4yg.jpg",
                    "publicId": "hulyvgcro7avwuywx4yg",
                    "_id": "6a9ab4346133a6fb9bb95937"
                }
            ],
            "likes": [],
            "comments": [],
            "createdAt": "2026-09-04T12:06:12.536Z",
            "updatedAt": "2026-09-04T12:21:48.123Z",
            "__v": 0
        }
    ]
}


{
    "content": "This is clean 🔥 BMW really knows how to make a statement."
}






{
    "success": true,
    "message": "Comment added successfully",
    "post": {
        "_id": "6a9ab1fc6133a6fb9bb95934",
        "author": "6a9a25e923b88b2b0939c903",
        "content": null,
        "image": [
            {
                "url": "https://res.cloudinary.com/doc865ug6/image/upload/v1788523004/eys9bw8wz39f2rwxxica.jpg",
                "publicId": "eys9bw8wz39f2rwxxica",
                "_id": "6a9ab1fc6133a6fb9bb95935"
            }
        ],
        "likes": [
            "6a9a25e923b88b2b0939c903"
        ],
        "comments": [
            {
                "user": "6a9a25e923b88b2b0939c903",
                "content": "This is clean 🔥 BMW really knows how to make a statement.",
                "likes": [],
                "_id": "6a9ce2e400791d905fc6406f"
            }
        ],
        "createdAt": "2026-09-04T11:56:44.268Z",
        "updatedAt": "2026-09-06T03:49:56.303Z",
        "__v": 4
    }
}