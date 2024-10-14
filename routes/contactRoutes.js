const express = require("express");
const router = express.Router();
const {getContacts , createContact,getContact,updateContact,deleteteContact} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getContacts).post(createContact);

// router.route("/").post(createContact);

router.route("/:id").get(getContact).put(updateContact).delete(deleteteContact);

// router.route("/:id").put(updateContact);

// router.route("/:id").delete(deleteteContact);

module.exports = router;  