// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const { firebaseConfig } = require('firebase-functions');
const FieldValue = require('firebase-admin').FieldValue;
const { ref } = require('firebase-functions/v1/database');


admin.initializeApp();


exports.FirstMatchDuringAccountCreating = functions.firestore
.document('users/{docId}')
.onCreate(async(snapshot, context) => {
    await snapshot.ref.set({
    'id':`${snapshot.id}`,
    'status':`sign_up`,
    'MatchPresence':false,
    'WaitingForMatch':'Waiting',
    'MatchedUsersIDs': admin.firestore.FieldValue.arrayUnion(snapshot.id),
    
  })
})


exports.hello = functions.https.onRequest(async (req, res) => {
  var collection = await admin.firestore().collection('users').doc('ad8mITa18ghxMDCBeM9TXREaMJ02').collection('fcm_tokens')

  collection.get().then(snapshot => {

    snapshot.forEach(doc => {
  
      console.log( doc.data().fcm_token ); 

      let FCM_token =  doc.data().fcm_token
      const payload = {
        token: FCM_token,
          notification: {
              title: 'cloud function demo',
              body: 'Hello'
          },
          data: {
              body: 'Hello',
          }
      };
      
      admin.messaging().send(payload).then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
          return {success: true};
      }).catch((error) => {
          return {error: error.code};
      });
      
  
    });
  })
  
})

exports.SearchNewPartner = functions.https.onRequest(async (req, res) => {
  let UserId =  req.query.id;
  var UserDocRef = await admin.firestore().collection('users').doc(UserId);
  var ArrayOfMatchedUsers = (await UserDocRef.get()).data().MatchedUsersIDs
  var community = (await UserDocRef.get()).data().community

  const UserForMatch = await admin.firestore().collection('users').where('status', '==', 'insearch').where('community', '==',`${community}`).where('id','not-in',ArrayOfMatchedUsers).limit(1).get();
 if (UserForMatch.empty) {
   console.log('No matching documents.');
   await UserDocRef.update({'WaitingForMatch':'NotWaiting',
  'status':'insearch'})
   return;
 }  
 UserForMatch.forEach (async doc => {
  
   const data = {
   users:[ doc.ref,UserDocRef ]
   }

   await admin.firestore().collection('matches').doc(`${Date.now()}`).set(data)
   console.log(doc.id, '=>', doc.data());

   await doc.ref.update({'status':'inpair',
   MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(UserDocRef.id),
   'current_match': UserDocRef,
   'MatchPresence':true,
   'WaitingForMatch':'MatchFound',
   'buttonForSearchingPressed':'alreadyTriggered',
   'form_presence':true,
   'chat_users_list': [UserDocRef, doc.ref],
  })

  var collection = await admin.firestore().collection('users').doc(`${doc.ref.id}`).collection('fcm_tokens')

  collection.get().then(snapshot => {

    snapshot.forEach(doc => {
  
      console.log( doc.data().fcm_token ); 

      let FCM_token =  doc.data().fcm_token
      const payload = {
        token: FCM_token,
          notification: {
              title: 'New match!',
              body: 'We found you a partner!'
          },
          data: {
              body: 'We found you a partner!',
          }
      };
      
      admin.messaging().send(payload).then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
          return {success: true};
      }).catch((error) => {
          return {error: error.code};
      });
      
  
    });
  })

  
  


   await UserDocRef.update({
  'status':'inpair',
   MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(doc.id),
   'current_match': doc.ref,
   'MatchPresence':true,
   'WaitingForMatch':'MatchFound',
   'buttonForSearchingPressed':'alreadyTriggered',
   'form_presence':true,
   'chat_users_list': [UserDocRef, doc.ref]
  })

  collection = await admin.firestore().collection('users').doc(`${UserDocRef.ref.id}`).collection('fcm_tokens')

  collection.get().then(snapshot => {

    snapshot.forEach(doc => {
  
      console.log( doc.data().fcm_token ); 

      let FCM_token =  doc.data().fcm_token
      const payload = {
        token: FCM_token,
          notification: {
              title: 'New match!',
              body: 'We found you a partner!'
          },
          data: {
              body: 'We found you a partner!',
          }
      };
      
      admin.messaging().send(payload).then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
          return {success: true};
      }).catch((error) => {
          return {error: error.code};
      });
      
  
    });
  })

 });
 
});


exports.SkipTheWeek = functions.https.onRequest(async (req, res) => {
    let UserId =  req.query.id;
   
    var UserDocRef = await admin.firestore().collection('users').doc(UserId);
    UserDocRef.update({
      'status':'inactive',
      'form_presence':false
    })
    return
})


exports.scheduledFunction = functions.pubsub.schedule('every 59 minutes').onRun(async (context) => {
 const usersForUpdate = await admin.firestore().collection('users').where('status', 'in', ['inpair','inactive']).get();
 if (usersForUpdate.empty) {
   console.log('No matching documents.');
   return;
 }  
 usersForUpdate.forEach (async doc => {
   await doc.ref.update({'status':'new_week'})
 });
 } 
);

exports.accept_invitation = functions.https. onRequest(async(req,res)=>{
  let UserId =  req.query.id;
  var UserDocRef = await admin.firestore().collection('users').doc(UserId);
  await UserDocRef.update({
    'status': 'insearch',
    'WaitingForMatch':'WaitingForNewWeek',
  })
})
   

  exports.WeeklySearch = functions.https.onRequest(async (req, res) => {
    var array = [];
    var communities = [];
    
    const UserForMatch = await admin.firestore().collection('users').where('status', '==', 'insearch').get();
  
    UserForMatch.forEach (async doc => {
    array.push(  doc.data())
   
    });
    for (let i = 0; i < array.length; i++) { 
      communities.push(array[i].community)
    }
  
    const unique = (value, index, self) => {
      return self.indexOf(value) === index
    }
    console.log(array)
    
    const UniqueCommunities = communities.filter(unique)
    console.log(`Unuque Communities ${UniqueCommunities}`)
  
    var IteratedUsersArray =[]

   for ( var i = 0 ; i < array.length ;i++){
    var UserId = array[i].id;
    var UserDocRef = await admin.firestore().collection('users').doc(UserId);
    var ArrayOfMatchedUsers = array[i].MatchedUsersIDs
    var community = array[i].community
  
    for(var j = 0; j < array.length ;j++){
      if(array[j].community == community && (!array[j].MatchedUsersIDs.includes(UserId)) && (!IteratedUsersArray.includes(UserId) ) && (!IteratedUsersArray.includes(array[j].id) )){
        console.log(array[j].id)
        var SecondUserDocRef = await admin.firestore().collection('users').doc(array[j].id);
        console.log('3')
        const data = {
            users:[ SecondUserDocRef,UserDocRef ]
            }
            await admin.firestore().collection('matches').doc(`${Date.now()}`).set(data)
            
            await SecondUserDocRef.update({
            'current_match': UserDocRef,
            'MatchPresence':true,
            'WaitingForMatch':'NotWaiting',
            'current_matchId': UserDocRef.id,
            
             MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(UserDocRef.id),
            'status':'inpair'
          })
        
  
       
            await UserDocRef.update({
            'current_match': SecondUserDocRef,
            'MatchPresence':true,
            'WaitingForMatch':'NotWaiting',
            'current_matchId':SecondUserDocRef.id,
            'status':'inpair',
             MatchedUsersIDs: admin.firestore.FieldValue.arrayUnion(SecondUserDocRef.id),   
          })

            IteratedUsersArray.push(array[j].id,UserId)
            console.log(IteratedUsersArray)
      }
    }
   }
 });