
    
    // model --> user.js
        
    import mongoose from "mongoose";

    // database schema 
    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true
        },
        bookmarks : {
            type: Array,
            default: [],
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
    })
    
    // creating model, why ?
    // behind the scene it works as class constructors 
    // const user    = our variable 
    // .model("User", ) = name in mongoDb 
    
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    
    
    import express from "express"
    import {isAuthenticated} from "../middleware/auth.js"
    import { addbookMark, allBookmarked, removeBookmark } from "../controllers/bookmarksController.js";
    
    const router = express.Router();
    
    
    // addding bookmark here
    router.post('/add/:id', isAuthenticated, addbookMark);
    
    
    //  to recieve all bookmarked items
    router.get('/all', isAuthenticated,  allBookmarked);
    
    
    // remove bookmarks
    router.delete('/remove/:id', isAuthenticated, removeBookmark);
    
    
    
    
    
    export default router
    
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////  Backend changes  //////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    
    
    // import bookmarked from "../models/bookmarkModel.js"
    // import Movies from "../models/bookmarkModel.js"
    // import tvShows from "../models/tvshowModel.js"
    import { User } from "../models/usersModel.js";
    
    
    export async function removeBookmark(req, res){
        const userId = req.user._id;
        cosnt {id} = req.params
    
        try {
            const currentUser = await User.find({ userId });
            let BookmarksIdArrayIndexOfRemoval =  currentUser.bookmarkes.indexOf(id)
    
             if (bookmarkIndex === -1) {
                return res.status(404).json({ success: false, message: "Bookmark not found" });
            }
            
            let newBookmarksArray = currentUser.bookmarkes.splice(BookmarksIdArrayIndexOfRemoval,1)
            await currentUser.save();
            return res.status(200).json({sucess:true,message:"Bookmark Removed"});
        } catch (error) {
             console.error(error);
            res.status(500).json({ error: 'Failed to delete bookmark' });
        }
        
    }
    
    
    export async function allBookmarked(req, res) {
        const userId = req.user._id;
    
        try {
            const currentUser = await User.find({ userId });
            res.status(200).json({sucess:true,data:currentUser.bookmarkes});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch bookmarks' });
        }
    }
    
    export async function addbookMark(req, res) {
        const {id} = req.params
        const userId = req.user._id;
    
        try {
            // Check if the bookmark already exists for the user and item
             const currentUser = await User.find({ userId });
             let isBookmarked = currentUser.bookmarkes.indexOf(id)
            if(isBookmarked>-1) return res.status(400).json({ error: 'Bookmark already exists' });
            else {
                currentUser.bookmarkes.push(id)
                 await currentUser.save();
                 return res.status(200).json({sucess:true,message:"Bookmark Added Successfully"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create bookmark' });
        }
    }
    
    
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    /////////////////////	Backend changed Part /////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    
    FRONTEND_URL = "http://localhost:3000"
    MONGODB_URL="mongodb://localhost:27017"
    NODE_ENV="Development"
    PORT=3000
    TOKEN="%^&*#"
    
    
    
    import  {User } from "../models/usersModel.js";
    
    export const addbookMark = async (req, res) => {
        const { id } = req.params;
        const userId = req.user._id;
    
        try {
            const user = await User.findById(userId); // Changed from find to findById
    
            if (user.bookmarks.includes(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Bookmark already exists", // Corrected message
                });
            }
    
            user.bookmarks.push(id); // Corrected bookmarks spelling
            await user.save();
    
            res.status(200).json({
                success: true,
                message: "Bookmark added successfully", // Corrected message
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to add bookmark' // Corrected message
            });
        }
    };
    
    // Changed method from find to findById to ensure single document return
    
    export const removeBookmark = async (req, res) => {
        const { id } = req.params;
        const userId = req.user._id;
    
        try {
            const user = await User.findById(userId); // Changed from find to findById
            const bookmarkIndex = user.bookmarks.indexOf(id); // Changed variable name to bookmarkIndex
    
            if (bookmarkIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: "Bookmark not found", // Corrected message
                });
            }
    
            user.bookmarks.splice(bookmarkIndex, 1); // Corrected bookmarks spelling
            await user.save();
    
            res.status(200).json({
                success: true,
                message: "Bookmark removed successfully", // Corrected message
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Failed to remove bookmark', // Corrected message
            });
        }
    };
    
    // Changed method from find to findById to ensure single document return
    export const allBookmarked = async (req, res) => {
        const userId = req.user._id;
    
        try {
            const user = await User.findById(userId); // Changed from find to findById
            res.status(200).json({
                success: true,
                data: user.bookmarks, // Corrected bookmarks spelling
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch bookmarks', // Corrected message
            });
        }
    };
    
    
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    /////////////////////// frontend part  ////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    
    
    // step 1
    // ab sun frontend k liye pehale login/Sign-up page bana kar uske mongodb jwt authenticate setup kardo 
    // aur uska redirect kardo home page 
    
    // step 2
    // watch list page par home page jaise sara data fetch karo 
    // get user use karo usse user aajaega
    
    // user.bookmarks = [ "array of id" ] 
    // ke elements ko filter out karlo 
    
    // ya toh 
    
    
    
    // Step 2 
    // ye code run karo har id k liye 
    
    const externalId = 'tt1234567';  // replace with your external ID
    const apiKey = 'YOUR_API_KEY';
    
    // Function to get full data for a movie or TV show
    const getFullData = (type, id) => {
      const url = type === 'movie'
        ? `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        : `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`;
      
      return fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log(`Full ${type} data:`, data);
        })
        .catch(error => console.error(`Error fetching ${type} data:`, error));
    };
    
    // Function to find the type and get full data
    const findAndGetData = (externalId) => {
      fetch(`https://api.themoviedb.org/3/find/${externalId}?api_key=${apiKey}&external_source=imdb_id`)
        .then(response => response.json())
        .then(data => {
          if (data.movie_results.length > 0) {
            const movieId = data.movie_results[0].id;
            getFullData('movie', movieId);
          } else if (data.tv_results.length > 0) {
            const tvId = data.tv_results[0].id;
            getFullData('tv', tvId);
          } else {
            console.log('No movie or TV show found with this ID.');
          }
        })
        .catch(error => console.error('Error finding data:', error));
    };
    
    // Call the function with the external ID
    findAndGetData(externalId);
    
    
    
    
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    /////////////////////// React full code ////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    
    
    
    
    
    
    import React, { useState, useEffect } from 'react';
    
    const apiKey = 'YOUR_API_KEY'; // Replace with your TMDB API key
    
    // Function to get full data for a movie or TV show
    const fetchFullData = async (type, id) => {
      const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error fetching ${type} data`);
        return response.json();
      } catch (error) {
        console.error(error);
        return null;
      }
    };
    
    // Function to find the type and get full data
    const fetchDataByExternalId = async (externalId) => {
      const url = `https://api.themoviedb.org/3/find/${externalId}?api_key=${apiKey}&external_source=imdb_id`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error finding data');
        const data = await response.json();
        if (data.movie_results.length > 0) {
          return fetchFullData('movie', data.movie_results[0].id);
        } else if (data.tv_results.length > 0) {
          return fetchFullData('tv', data.tv_results[0].id);
        }
        console.log('No movie or TV show found with this ID.');
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    };
    
    const Watchlist = () => {
      const [data, setData] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        const fetchBookmarksData = async () => {
          try {
            const userResponse = await fetch('http://localhost:3000/user/getMyProfile', {
              method: 'GET',
              credentials: 'include',
            });
            if (!userResponse.ok) throw new Error('Failed to fetch user profile');
            const userData = await userResponse.json();
    
            if (userData.success) {
              const fetchPromises = userData.user.bookmarks.map(externalId => fetchDataByExternalId(externalId));
              const results = await Promise.all(fetchPromises);
              setData(results.filter(item => item !== null));
            }
          } catch (error) {
            setError(error.message);
            console.error('Error fetching user data or bookmarks:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchBookmarksData();
      }, []);
    
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;
    
      return (
        <div>
          <h1>Watchlist</h1>
          {data.length === 0 ? (
            <p>No bookmarks found</p>
          ) : (
            <ul>
              {data.map((item) => (
                <li key={item.id}>
                  <h2>{item.title || item.name}</h2>
                  <p>{item.overview}</p>
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                    alt={item.title || item.name} 
                    style={{ width: '200px', height: 'auto' }} 
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };
    
    export default Watchlist;
    
    
    
    
    
    
    // .model("User", userSchema) = storing userSchema in user in mongodb 
    export const User = mongoose.model("User", userSchema);