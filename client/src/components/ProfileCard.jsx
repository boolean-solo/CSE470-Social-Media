import moment from "moment";
import React from "react";
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsPersonFillAdd,
} from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { LiaEditSolid } from "react-icons/lia";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { useDispatch, useSelector } from "react-redux";
import { UpdateProfile } from "../redux/userSlice";
import { sendFriendRequest, handleUnfriend, handleProfileView } from "../utils";
import {useEffect} from "react";

const ProfileCard = ({ user }) => {
  
};

export default ProfileCard;
