import createPersistedState from "vuex-persistedstate";
import { ApiMovie } from "@/types/api/apiMovie";
import { Review } from "@/types/review";
import { TimeList } from "@/types/timeList";
import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import { Movie } from "@/types/movie";
import { Comment } from "@/types/comment";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    movieList: Array<Movie>(),
  },
  actions: {
    async asyncGetMovieList(context) {
      const response = await axios.get<{
        page: number;
        results: Array<ApiMovie>;
      }>(
        "https://api.themoviedb.org/3/discover/movie?api_key=b5408f6aa5f27ebad281342354c0e1f9&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_original_language=en&with_watch_monetization_types=flatrate"
      );
      const payload = response.data;
      context.commit("showItemList", payload);
    },
  },
  mutations: {
    showItemList(state, payload) {
      state.movieList = new Array<Movie>();
      for (const movie of payload.results) {
        state.movieList.push(
          new Movie(
            movie.adult,
            movie.backdrop_path,
            movie.genre_ids,
            movie.id,
            movie.original_language,
            movie.original_title,
            movie.overview,
            movie.popularity,
            movie.poster_path,
            movie.release_date,
            movie.title,
            movie.video,
            movie.vote_average,
            movie.vote_count,
            [""],
            new Array<TimeList>(),
            [
              new Review(0, 0, 634649, 30, new Date(), "サイコー！！", [
                new Comment(0, 0, 0, new Date(), "ナイスレビュー！！"),
              ]),
              new Review(1, 0, 634649,40, new Date(), "最高の仕上がり!!", [
                new Comment(0, 0, 0, new Date(), "ナイスレビュー！！"),
              ]),
            ],
            0,
            0
          )
        );
      }
    },

    /**
     * レビューの追加
     * @param state ‐state
     * @param payload -payload
     */
    addReview(state, payload) {
      console.log(state.movieList);
      console.log(payload);

      const currentMovie = state.movieList.filter(
        (movie) => movie.id === payload.movieId
      )[0];
      console.log(currentMovie);

      // const newReview = {
      //   review: new Review(
      //     payload.review.id,
      //     payload.review.userId,
      //     payload.review.movieId,
      //     payload.review.countLike,
      //     payload.review.postDate,
      //     payload.review.content,
      //     []
      //   ),
      // };
      // currentMovie.reviewList.unshift(payload.review);
      currentMovie.reviewList.unshift(payload.review);
      console.log(currentMovie.reviewList);
    },
  }, //end of mutations

  modules: {},
  getters: {
    getMovieList(state) {
      return state.movieList;
    },
    //渡されたジャンルIDと同じIDを返す
    getGenreById(state) {
      return (genre_ids: Array<number>) => {
        const sameGenreGroup = [];
        for (const id of genre_ids) {
          sameGenreGroup.push(
            state.movieList.filter((movie) => movie.genre_ids[0] === id)
          );
        }
        return sameGenreGroup;
      };
    },
    /**
     * detailに表示されている映画情報の取得.
     * @param state
     * @returns movieId
     */
    getcurrentMovie(state) {
      return (movieId: number) => {
        const newArray = [];
        for(const movie of state.movieList){
          if(movie.id === movieId){
            newArray.push(movie);
          }
        }
        console.log(newArray[0]);
        return newArray[0];
        // state.movieList.filter((movie) => movie.id === movieId)[0];
      };
    },
  },
  plugins: [
    createPersistedState({
      // ストレージのキーを指定
      key: "vuex",
      // 管理対象のステートを指定
      paths: ["count"],
      // ストレージの種類を指定
      storage: window.sessionStorage,
    }),
  ],
});
