// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');
const StreamChat = require('stream-chat').StreamChat;

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const { firebaseConfig } = require('firebase-functions');
const FieldValue = require('firebase-admin').FieldValue;

const {Telegraf} = require('telegraf');

const TOKEN = '5594270299:AAFidujPwvekgRaWlv2ahyoaKGlUOUDtDMA'

const bot = new Telegraf(TOKEN, {
  telegram: {webhookReply: true}
})

const axios = require('axios').default;

admin.initializeApp();

// FOR FLUTTER PROJECT 1
  //   exports.FirstMatchDuringAccountCreating = functions.firestore
  // .document('users/{docId}')
  // .onCreate(async(snapshot, context) => {
    
  //   await snapshot.ref.update({
  //     MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(snapshot.id)
  //   });
  //   await snapshot.ref.update({
  //   'id':`${snapshot.id}`,
  //   'status':`active`,
  //   'MatchPresence':false
  // })
    
  //   //Initialize process of searching for a match
  //   let UserId =  await snapshot.id;
  //   var community =  await snapshot.data().community;
    
    

  //   const UserForMatch = await admin.firestore().collection('users').where('status', '==', 'active').where('community', '==',`${community}`).where('id','!=',UserId).where('MatchPresence', '==', false).limit(1).get();
  //   if (UserForMatch.empty) {
  //    console.log('No matching documents.');
  //    await snapshot.ref.update({
  //     'WaitingForMatch':'NotWaiting',
  //     'current_match':'',
  //     'current_matchId':''
  //   })
   
  //    return;
  //  }  
  //   UserForMatch.forEach (async doc => {
      
  //   const data = {
  //   users:[ doc.ref,snapshot.ref ]
  //   }
  //   await admin.firestore().collection('matches').doc(`${Date.now()}`).set(data)
    

    
  //   await doc.ref.update({
  //    MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(UserId)
  //  });
  //  await doc.ref.update({
  //  'current_match': snapshot.ref,
  //  'MatchPresence':true,
  //  'WaitingForMatch':'NotWaiting',
  //  'current_matchId':snapshot.ref.id
  // })


   
  //   await snapshot.ref.update({
  //    MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(doc.id)
  //  });
  //  await snapshot.ref.update({'current_match': doc.ref,
  //  'MatchPresence':true,
  //  'WaitingForMatch':'NotWaiting',
  //  'current_matchId':doc.ref.id })
  // });



  // });

    // FOR FLUTTER PROJECT 1    
  


  


//FOR FLUTTERFLOW



exports.FirstMatchDuringAccountCreating = functions.firestore
.document('users/{docId}')
.onCreate(async(snapshot, context) => {
    await snapshot.ref.set({
    'id':`${snapshot.id}`,
    'status':`active`,
    'MatchPresence':false,
    'just_signed_up':true,
    'WaitingForMatch':'Waiting',
    'MatchedUsersIDs': admin.firestore.FieldValue.arrayUnion(snapshot.id),
    
  })
})

   exports.SearchingForNewPartner = functions.firestore
  .document('users/{userId}')
  .onUpdate(async(change, context) => {
    

    var ValueForChangedButton = await change.after.data().buttonForSearchingPressed
    
    
       if ( ValueForChangedButton == "trigger"){
   var ArrayOfMatchedUsers = change.before.data().MatchedUsersIDs
   var community = change.before.data().community
   const UserForMatch = await admin.firestore().collection('users').where('status', '==', 'active').where('community', '==',`${community}`).where('id','not-in',ArrayOfMatchedUsers).limit(1).get();
   if (UserForMatch.empty) {
     console.log('No matching documents.');
     await change.before.ref.update({'WaitingForMatch':'NotWaiting'})
     return;
   }  
   UserForMatch.forEach (async doc => {
    
     const data = {
     users:[ doc.ref,change.before.ref ]
     }

     await admin.firestore().collection('matches').doc(`${Date.now()}`).set(data)
     console.log(doc.id, '=>', doc.data());

     await doc.ref.update({'status':'unactive',
     MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(change.before.id),
     'current_match': change.before.ref,
     'MatchPresence':true,
     'WaitingForMatch':'MatchFound',
     'buttonForSearchingPressed':'alreadyTriggered'
    })
    


     await change.before.ref.update({
    'status':'unactive',
     MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(doc.id),
     'current_match': doc.ref,
     'MatchPresence':true,
     'WaitingForMatch':'MatchFound',
     'buttonForSearchingPressed':'alreadyTriggered'})
   });
   } 
});
//FOR FLUTTERFLOW





  // FOR FLUTTER PROJECT 2    
// exports.SearchingForPartnerHTTPRequest = functions.https.onRequest(async (req, res) => {
   
  
//     let UserId =  req.query.id;
   
//     var UserDocRef = await admin.firestore().collection('users').doc(UserId);
//     var ArrayOfMatchedUsers = await (await UserDocRef.get()).data().MatchedUsersIDs;
//     var email = await (await UserDocRef.get()).data().email;
//     var community = await (await UserDocRef.get()).data().community;

//     const UserForMatch = await admin.firestore().collection('users').where('status', '==', 'active').where('community', '==',`${community}`).where('id','not-in',ArrayOfMatchedUsers).where('MatchPresence', '==', false).limit(1).get();
//     if (UserForMatch.empty) {
//      console.log('No matching documents.');
//      UserDocRef.update({'WaitingForMatch':'NotWaiting'})
//      return;
//    }  
//    UserForMatch.forEach (async doc => {
    
//     const data = {
//     users:[ doc.ref,UserDocRef ]
//     }
//     await admin.firestore().collection('matches').doc(`${Date.now()}`).set(data)
//     console.log(doc.id, '=>', doc.data());

    
//     await doc.ref.update({
//      MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(UserDocRef.id)
//    });
//    await doc.ref.update({'current_match': UserDocRef})
//    await doc.ref.update({'MatchPresence':true})
//    await doc.ref.update({'WaitingForMatch':'NotWaiting'})

   
//     await UserDocRef.update({
//      MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(doc.id)
//    });
//    await UserDocRef.update({'current_match': doc.ref })
//    await UserDocRef.update({'MatchPresence':true})
//    await UserDocRef.update({'WaitingForMatch':'NotWaiting'})

//   });
//   });
  // FOR FLUTTER PROJECT 2
  
    // FOR FLUTTER PROJECT 3    

//   exports.WeeklySearch = functions.https.onRequest(async (req, res) => {
//     var array = [];
//     var communities = [];
  
//     const UserForMatch = await admin.firestore().collection('users').where('status', '==', 'active').get();
  
//     UserForMatch.forEach (async doc => {
//     array.push(  doc.data())
//     });
//     for (let i = 0; i < array.length; i++) { 
//       communities.push(array[i].community)
      
//     }
  
//     const unique = (value, index, self) => {
//       return self.indexOf(value) === index
//     }
//     const UniqueCommunities = communities.filter(unique)
  
//     var IteratedUsersArray =[]
//    for ( var i = 0 ; i < array.length ;i++){
//     var UserId = array[i].id;
//     var UserDocRef = await admin.firestore().collection('users').doc(UserId);
//     var ArrayOfMatchedUsers = array[i].MatchedUsersIDs
//     var community = array[i].community
  
//     for(var j = 0; j < array.length ;j++){
//       if(array[j].community == community && (!array[j].MatchedUsersIDs.includes(UserId)) && (!IteratedUsersArray.includes(UserId) ) && (!IteratedUsersArray.includes(array[j].id) )){
//         console.log(array[j].id)
//         var SecondUserDocRef = await admin.firestore().collection('users').doc(array[j].id);
//         const data = {
//             users:[ SecondUserDocRef,UserDocRef ]
//             }
//             await admin.firestore().collection('matches').doc(`${Date.now()}`).set(data)
//             await SecondUserDocRef.update({
//             MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(UserDocRef.id)
//           });
//             await SecondUserDocRef.update({'current_match': UserDocRef})
//             await SecondUserDocRef.update({'MatchPresence':true})
//             await SecondUserDocRef.update({'WaitingForMatch':'NotWaiting'})
//             await SecondUserDocRef.update({'current_matchId': UserDocRef.id})
  
//             await UserDocRef.update({
//             MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(SecondUserDocRef.id)
//           });
//             await UserDocRef.update({'current_match': SecondUserDocRef })
//             await UserDocRef.update({'MatchPresence':true})
//             await UserDocRef.update({'WaitingForMatch':'NotWaiting'})
//             await UserDocRef.update ({'current_matchId':SecondUserDocRef.id})

//             IteratedUsersArray.push(array[j].id,UserId)
//             console.log(IteratedUsersArray)
//       }
      
  
//     }
  
//    }
//  });
    // FOR FLUTTER PROJECT 3  

//  const serverClient = StreamChat.getInstance(functions.config().stream.key, functions.config().stream.secret);


// When a user is deleted from Firebase their associated Stream account is also deleted.
exports.deleteStreamUser = functions.auth.user().onDelete((user, context) => {
  return serverClient.deleteUser(user.uid);
});

// Create a Stream user and return auth token.
exports.createStreamUserAndGetToken = functions.https.onCall(async (data, context) => {
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    try {
      // Create user using the serverClient.
      await serverClient.upsertUser({
        id: context.auth.uid,
        name: context.auth.token.name,
        email: context.auth.token.email,
        image: context.auth.token.image,
      });

      /// Create and return user auth token.
      return serverClient.createToken(context.auth.uid);
    } catch (err) {
      console.error(`Unable to create user with ID ${context.auth.uid} on Stream. Error ${err}`);
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('aborted', "Could not create Stream user");
    }
  }
});

// Get Stream user token.
exports.getStreamUserToken = functions.https.onCall((data, context) => {
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    try {
      return serverClient.createToken(context.auth.uid);
    } catch (err) {
      console.error(`Unable to get user token with ID ${context.auth.uid} on Stream. Error ${err}`);
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('aborted', "Could not get Stream user");
    }
  }
});

// Revoke the authenticated user's Stream chat token.
exports.revokeStreamUserToken = functions.https.onCall((data, context) => {
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    try {
      return serverClient.revokeUserToken(context.auth.uid);
    } catch (err) {
      console.error(`Unable to revoke user token with ID ${context.auth.uid} on Stream. Error ${err}`);
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('aborted', "Could not get Stream user");
    }
  }
});


exports.getStreamUserToken = functions.https.onCall((data, context) => {
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    try {
      return serverClient.createToken(context.auth.uid);
    } catch (err) {
      console.error(`Unable to get user token with ID ${context.auth.uid} on Stream. Error ${err}`);
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('aborted', "Could not get Stream user");
    }
  }
});



// bot testing 
bot.command('/flights', async (ctx)=>{

  telegram_id = ctx.from.id
  const registered_user = await admin.firestore().collection('test_users').where('id', '==', telegram_id).limit(1).get()
  if(registered_user.empty){
  return 
  }
  registered_user.forEach( async doc => {
    var status = await doc.data().status
    if (status == 'reg_done'){
     
      var flights = await doc.data().flights
      functions.logger.log(flights.length)
      var inline_keyboard =[]
      for( var i = 0; i < flights.length ; i++){
        var obj = {
          text: flights[0],
          callback_data: flights[0]
        }
        inline_keyboard.push(obj)

      }
      functions.logger.log(inline_keyboard)
      await  ctx.reply('Your flights',{
        reply_markup:{
        inline_keyboard:[
          inline_keyboard
        ]
      }
      })

      
      }
    })

})
bot.command('/search_for_partner', async(ctx)=>{
  telegram_id = ctx.from.id
  const registered_user = await admin.firestore().collection('test_users').where('id', '==', telegram_id).limit(1).get()
  if(registered_user.empty){
  return 
  }
  registered_user.forEach( async doc => {
    var status = await doc.data().status
     
      await  ctx.reply("Enter the flight number")
      await doc.ref.update({
        'status':"searching_for_match" 
       })
      
    })
})

bot.command('/profile', async(ctx)=>{
  telegram_id = ctx.from.id
  const registered_user = await admin.firestore().collection('test_users').where('id', '==', telegram_id).limit(1).get()
  if(registered_user.empty){
  return 
  }
  registered_user.forEach( async doc => {
    var status = await doc.data().status
    if (status == 'reg_done'){
     
      var name = await doc.data().name
      var pic = await doc.data().photo_url
      var desc = await doc.data().desc
      
      
      await  ctx.reply(`Your profile info: \n Name:${name} \nDescription:${desc}`)
      await ctx.reply('Press one of the buttons to update your profile info',{
        reply_markup:{
        inline_keyboard:[
          [{ text: "/Name", callback_data: "/Name" },{ text: "/Photo", callback_data: "/Photo" },{ text: "/About", callback_data: "/About" }]
        ]
      }
      })

      }
    })
})

bot.command('/start', async(ctx)=>{
  await  ctx.reply('Hello! This is the service that is able to find you your flight partner')

  var telegram_id = ctx.from.id

  const registered_user = await admin.firestore().collection('test_users').where('id', '==', telegram_id).limit(1).get()
  if(registered_user.empty){
  await  ctx.reply('to use our services, you need to sign up',{
      reply_markup:{
      inline_keyboard:[
        [{ text: "register", callback_data: "register" }]
      ]
    }
    })
  var new_user = {
    id: ctx.message.from.id,
    status: 'typing_name'
  } 
  await admin.firestore().collection('test_users').doc(`${ctx.message.from.id}`).set(new_user) 
    
  }
  return
})

bot.on('callback_query', async(ctx) => {
  if(ctx.callbackQuery.data == 'register'){
    var telegram_id = ctx.chat.id

    const registered_user = await admin.firestore().collection('test_users').where('id', '==', telegram_id).limit(1).get()
  if(registered_user.empty){
  return
  }
  await ctx.reply('Type your name');
  registered_user.forEach( async doc => {
    await doc.ref.update({
     'status':"typing_name" 
    })
  })
  }
  if(ctx.callbackQuery.data == '/Name'){
    var telegram_id = ctx.chat.id
    const registered_user = await admin.firestore().collection('test_users').where('id', '==', telegram_id).limit(1).get()
  if(registered_user.empty){
  return
  }
  registered_user.forEach( async doc => {
    await ctx.reply('Please type your name')
    await doc.ref.update({
     'status':"updating_name"
    })
  })
  }
  if(ctx.callbackQuery.data == '/About'){
    var telegram_id = ctx.chat.id
    const registered_user = await admin.firestore().collection('test_users').where('id', '==', telegram_id).limit(1).get()
  if(registered_user.empty){
  return
  }
  registered_user.forEach( async doc => {
    await ctx.reply('Please type your desc')
    await doc.ref.update({
     'status':"updating_desc" 
    })
  })
  } 
  var telegram_id = ctx.chat.id
  const registered_user = await admin.firestore().collection('test_users').where('id', '==', telegram_id).limit(1).get()






  
if(registered_user.empty){
return
}
registered_user.forEach( async doc => {
   //logics for renaming user
  if (doc.data().status == 'updating_name_confirm'){
    await  ctx.reply('Name updated')
    await doc.ref.update({
      'name':ctx.callbackQuery.data
    })
   }
   if (doc.data().status == 'searching_for_match_confirm'){
    await doc.ref.update({
      'status':'searching_for_match_in_the_process',
      'flight_for_matching' : ctx.callbackQuery.data
    })
   

    var matched_users = await admin.firestore().collection('test_users').where('id', '!=', telegram_id).where('flights','array-contains',ctx.callbackQuery.data ).limit(1).get()
    if (matched_users.empty){
      await ctx.reply('Sorry, there are no matches. Once they appear, we will let you know!')
      return
    }
    matched_users.forEach(async doc => {
      var user = await doc.data()
      await ctx.reply(`We found a user for you!\n`)
      await ctx.replyWithPhoto('AgACAgIAAxkBAAIDsWKjG-FVjteiN3rNKK5vQ9-pyPjIAALtuzEbszEZSeVwTcnrWhpiAQADAgADeQADJAQ')
      await ctx.reply(`Name:${user.name}\nDesc:${user.desc}`,{
        reply_markup:{
        inline_keyboard:[
          [{ text: "Connect!", callback_data: "Connect" }, { text: "Skip!", callback_data: "Skip" }]
        ]


        
      }
      })
      registered_user.forEach(async doc => {
        await doc.ref.update({
          'current_suggestion': `${user.id}`
        })
       
      })
      
    })
   }



  
})

if (ctx.callbackQuery.data == "Connect"){
  registered_user.forEach(async doc => {
    var user_data = await doc.data()
    if (user_data.current_suggestion != ''){
      var matched_user = await admin.firestore().collection('test_users').where('id', '==', user_data.current_suggestion).limit(1).get()
      matched_user.forEach( async (doc) => {
      await ctx.telegram.sendMessage('335458847', 'Hi there! Somebody wants to contact you! Do you want to start chat?',{
        reply_markup:{
        inline_keyboard:[
          [{ text: "Yes!", callback_data: '335458847'}]
        ]        
      }
      })  
        
      })
    }
  })
}


})

bot.on('text', async (ctx) => {
  telegram_id = ctx.from.id
  const registered_user = await admin.firestore().collection('test_users').where('id', '==', telegram_id).limit(1).get()
  if(registered_user.empty){
  return 
  }
  registered_user.forEach( async doc => {
  var status = await doc.data().status
  if (status == 'typing_name'){
    await ctx.reply('Amazing! Now set your profile photo')
   
    await doc.ref.update({
      "name": ctx.message.text,
      'status':'setting_profile'
    })
  }
  if (status =="setting_description"){
    await ctx.reply('Great! You can user our app! To use the app, you need can user three comands:\n /search_for_partner\n /profile\n /flights')
    await doc.ref.update({
      'desc': ctx.message.text,
      'status':'reg_done'
    })
  }
  if(status == "updating_name"){
   
  ctx.reply('Are you sure?',{
    reply_markup:{
    inline_keyboard:[
      [{ text: "Yes!", callback_data: ctx.message.text }]
    ]
    
  }
  })
  
  await doc.ref.update({
     'status':'updating_name_confirm'
  })
 
   
   
  }
  if(status == "updating_desc"){
    await ctx.reply('Great! Your desc has been updated')
    await doc.ref.update({
      'desc':ctx.message.text
    })
  }
  if(status == "searching_for_match"){
    await ctx.reply('Are you sure?',{
      reply_markup:{
      inline_keyboard:[
        [{ text: "Yes!", callback_data: ctx.message.text }]
      ]
    }
    })
    await doc.ref.update({
      
      'status':'searching_for_match_confirm'
   })
    }

  })


})



bot.on('photo', async (ctx) =>{
  telegram_id = ctx.from.id
  const registered_user = await admin.firestore().collection('test_users').where('id', '==', telegram_id).limit(1).get()
  if(registered_user.empty){
  return 
  }
  registered_user.forEach( async doc => {
  var status = await doc.data().status
  if (status == 'setting_profile'){
    await ctx.reply('Amazing! Now set your desk')
   var length = ctx.message.photo.length
   var photo_file_id = ctx.message.photo[length - 1].file_id
   functions.logger.log(photo_file_id)
   var pic_file_path
   pic_file_path =  await axios.get(`https://api.telegram.org/bot5594270299:AAFidujPwvekgRaWlv2ahyoaKGlUOUDtDMA/getFile?file_id=${photo_file_id}`).then(response => response.data.result.file_path).then(response => response)
   
   var pic_url = `https://api.telegram.org/file/bot5594270299:AAFidujPwvekgRaWlv2ahyoaKGlUOUDtDMA/${pic_file_path}`
   functions.logger.debug(pic_url)
  //  axios({
  //    method:'get',
  //    url:`https://api.telegram.org/bot5594270299:AAFidujPwvekgRaWlv2ahyoaKGlUOUDtDMA/getFile?file_id=${photo_obj}`
  //  })
  // .then(function (response) {
  //   // handle success
  //   pic_url = `https://api.telegram.org/file/bot5594270299:AAFidujPwvekgRaWlv2ahyoaKGlUOUDtDMA/${response.data.result.file_path}`
  //   functions.logger.log(pic_url)
  //   return pic_url
    
  // })
  // .catch(function (error) {
  //   // handle error
  //   console.log(error);
  // });
  
   
  await doc.ref.update({
    'photo_url': pic_url,
    'status':'setting_description'
  })
  }
  return
  })

})

exports.echoBot = functions.https.onRequest(async(request,response)=>{
  functions.logger.log('incoming message', request.body);
  bot.handleUpdate(request.body,response)
})