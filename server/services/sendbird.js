const SendBird = require('sendbird');
const sb = new SendBird({appId: process.env.SENDBIRD_APP_ID});


module.exports.sbCreateNotifMessage = (userId, message, task) => {
  console.log("CREATE NOTIF MESSAGE: ", userId, message, task)
  const params = new sb.UserMessageParams();
  params.message = message;
  params.mentionType = 'users';                       // Either 'users' or 'channel'
  params.mentionedUserIds = [userId];        // Or mentionedUsers = Array<User>;
  params.metaArrays = [   // A pair of key-value
      new sb.MessageMetaArray('taskId', [task._id.toString()]),
      new sb.MessageMetaArray('plantId', [task.plantId._id.toString()]),
      new sb.MessageMetaArray('plantName', [task.plantId.title.toString()]),
  ];
  if (task.plantId && task.plantId.imageURLs && task.plantId.imageURLs.length > 0) {
    params.metaArrays.push(new sb.MessageMetaArray('plantImageURLs', [task.plantId.imageURLs[0]]))
  }
  params.pushNotificationDeliveryOption = 'default';  // Either 'default' or 'suppress'
  return params;
}

module.exports.sbGroupChannelGetChannel = (channelUrl) => {
  return new Promise((resolve, reject) => {
    sb.GroupChannel.getChannel(channelUrl, (groupChannel, error) => {
      error ? reject(error) : resolve(groupChannel);
    });
  });
}
module.exports.sbGroupChannelSendUserMessage = (groupChannel, messageParams) => {
  return new Promise((resolve, reject) => {
    groupChannel.sendUserMessage(messageParams, (message, error) => {
      error ? reject(error) : resolve(message);
    });
  });
}

module.exports.sbConnect = userId => {
  return new Promise((resolve, reject) => {
    sb.connect(userId, (user, error) => {
      error ? reject(error) : resolve(user);
    });
  });
}

module.exports.sbUpdateCurrentUserInfo = (nickname, profileUrl) => {
  return new Promise((resolve, reject) => {
    sb.updateCurrentUserInfo(nickname, profileUrl, (user, error) => {
      error ? reject(error) : resolve(user);
    })
  });
}

module.exports.sbCreateChannelWithUserIds = (userIds, distinct, name) => {
  return new Promise((resolve, reject) => {
    sb.GroupChannel.createChannelWithUserIds(userIds, distinct, name, (channel, error) => {
      error ? reject(error): resolve(channel);
    });
  });
}
module.exports.genSendBirdUserID = function(email,_id) {
  if (!_id || _id.toString().length == 0 || _id.toString().trim() == "") {
    return email + Math.floor(Math.random() * (100000 - 0)) + 0;
  }

  return email + _id.toString().substring(0,6);
}

module.exports.sendBird = sb;