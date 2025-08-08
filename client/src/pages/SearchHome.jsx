import React, { useEffect, useState } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import {
  CustomButton,
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,

  TopBar,
} from "../components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  apiRequest,
  deletePost,
  getUserInfo,

  likePost,
  sendFriendRequest,
} from "../utils";
import { useForm } from "react-hook-form";
import { NoProfile } from "../assets";
import { UserLogin } from "../redux/userSlice";
import { useLocation } from "react-router-dom";
import UserCard from "../components/UserCard";

const SearchHome = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  const {
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const dispatch = useDispatch();
  const { user, edit } = useSelector((state) => state.user);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);

  const fetchPost = async () => {
    if (!query || query.trim() === "") {
      setPosts([]);
      setUsers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequest({
        url: "/users/search?q=" + query,
        method: "GET",
      });
      setPosts(res?.posts || []);
      setUsers(res?.users || []);
    } catch (error) {
      console.log(error);
      setPosts([]);
      setUsers([]);
    }
    setLoading(false);
  };



  const handleLikePost = async (uri) => {
    await likePost({ uri: uri, token: user?.token });
    await fetchPost();
  };

  const handleDelete = async (id) => {
    await deletePost(id, user.token);
    await fetchPost();
  };


  const fetchFriendRequests = async () => {
    try {
      const res = await apiRequest({
        url: "/users/get-friend-request",
        token: user?.token,
        method: "POST",
      });
      setFriendRequest(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuggestedFriends = async () => {
    try {
      const res = await apiRequest({
        url: "/users/suggested-friends",
        token: user?.token,
        method: "POST",
      });
      setSuggestedFriends(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFriendRequest = async (id) => {
    try {
      const res = await sendFriendRequest(user.token, id);
      await fetchSuggestedFriends();
    } catch (error) {
      console.log(error);
    }
  };

  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await apiRequest({
        url: "/users/accept-request",
        token: user?.token,
        method: "POST",
        data: { rid: id, status },
      });
      setFriendRequest(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    const res = await getUserInfo(user?.token);
    const newData = { token: user?.token, ...res };
    dispatch(UserLogin(newData));
  };

  useEffect(() => {
    getUser();
    fetchFriendRequests();
    fetchSuggestedFriends();
  }, []);

  useEffect(() => {
    fetchPost();
  }, [query]); 

  return (
    <>
      <div className="w-full px-0 lg:px-10 pb-5 md:pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar />
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto md:pl-4 lg:pl-0">
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* CENTER */}
          <div className=" flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto">
            <h1 className="h1 text-white">Users Result</h1>

            {loading ? (
              <Loading />
            ) : users?.length > 0 ? (
              users.map((user) => <UserCard key={user?._id} user={user} />)
            ) : (
              <p className="text-lg text-ascent-2">No Users Found</p>
            )}

            <h1 className="h1 text-white mt-6">Posts Result</h1>
            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>


        
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default SearchHome;
