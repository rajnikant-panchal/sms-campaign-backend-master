/**
 * MessageFileController
 *
 * @description :: Server-side logic for managing Messagefiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	saveMessageFile: function(req, res) {
    var deferred;
    var tmp_fd;
    var tmp_filename;
    var final_filename;
    var message_file_obj;
    var session_user = req.session.user;
    req.file('file_path').upload(function(err, uploadedFiles) {
      if(err) {
        throw err;
      }
      if(uploadedFiles.length === 1) {
        //No file received. So, only save db object
        tmp_fd = uploadedFiles[0].fd;
        tmp_filename = uploadedFiles[0].filename;
      }
      req.body.uploaded_by = session_user.id;
      if(req.body.id) {
        //Update
        deferred = MessageFile.update({id: req.body.id}, req.body);
      }
      else {
        //Create
        req.body.created_by = session_user.id;
        deferred = MessageFile.create(req.body);
      }
      deferred.then(function(resp) {
        message_file_obj = resp;
        if(resp.constructor===Array) {
          message_file_obj = resp[0];
        }
        if(tmp_fd && tmp_filename) {
          //Save File
          final_filename = message_file_obj.id + '_' + tmp_filename;
          return UploadService.uploadFile({id: message_file_obj.id}, tmp_fd, "MessageFile", final_filename);
        }
        else {
          //Return created
          throw {
            status: "SAVED_NO_IMAGE",
            obj: message_file_obj
          };
        }
      })
      .then(function(response) {
        return MessageFile.update({id: message_file_obj.id}, {file_name: final_filename});
      })
      .then(function(respo) {
        return res.ok(customResponse.orderappResponse("SUCCESS", "MessageFile saved successfully.", respo));
      })
      .catch(function(err) {
        console.log("err -------------------- ", err);
        if(err.status && err.status=="SAVED_NO_IMAGE") {
          return res.ok(customResponse.orderappResponse("SUCCESS", "MessageFile saved successfully.", err.obj));
        }
        else {
          return res.serverError(customResponse.orderappResponse("ERROR", "Error adding message_file.", err));
        }
      });
    });
  },
};

