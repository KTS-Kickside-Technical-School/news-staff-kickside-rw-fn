import axiosInstance from "../axios/axiosInstance";

export const handleError = (error: any) => {
  if (error.response) {
    return {
      status: error.response.status,
      message:
        error.response.data.message ||
        "Something went wrong. Please try again.",
    };
  }
  return {
    status: 500,
    message: error.message || "Unexpected error occurred. Please try again.",
  };
};

export const getPublishedArticles = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/articles/get-published-articles"
    );
    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const getSingleArticle = async (slug: String) => {
  try {
    const response = await axiosInstance.get(
      `/api/articles/get-single-article/${slug}`
    );
    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const getOwnArticles = async () => {
  try {
    const response = await axiosInstance.get("/api/articles/get-own-articles");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const publishArticle = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      "/api/articles/create-article",
      data
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const postComment = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      "/api/articles/post-comments",
      data
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getAllArticles = async () => {
  try {
    const response = await axiosInstance.get("/api/articles/get-all-articles");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const staffGetSingleArticle = async (id: any) => {
  try {
    const response = await axiosInstance.get(
      `/api/articles/get-own-single-article/${id}`
    );
    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const staffToggleArticlePublish = async (id: any) => {
  try {
    const response = await axiosInstance.put(
      `/api/articles/toggle-article-publish/${id}`
    );
    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const staffDeleteArticle = async (id: any) => {
  try {
    const response = await axiosInstance.delete(
      `/api/articles/delete-article/${id}`
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getArticleEditRequests = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/articles/get-all-articles-edit-requests"
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const approveEditRequest = async (id: any) => {
  try {
    const response = await axiosInstance.put(
      `/api/articles/confirm-edit-request/${id}`
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const journalistRequestEditAccess = async (id: any) => {
  try {
    const response = await axiosInstance.post(`/api/articles/request-edit-access/${id}`);
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

export const journalistFindAnalysis = async (year: any) => {
  try {
    const response = await axiosInstance.get(`/api/articles/get-journalists-analytics/${year}`)
    return response.data
  } catch (error) {
    return handleError(error);
  }
}

export const getAuthorsProfile = async (username: any) => {
  try {
    const response = await axiosInstance.get(`/api/articles/get-author-profile/${username}`);
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

export const getArticlesByCategory = async (category: string) => {
  try {
    const response = await axiosInstance.get(
      `api/articles/get-articles-by-category/${category}`
    );

    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
};


export const updateArticle = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/api/articles/journalist-edit-article/${id}`, data);
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

export const getPopularArticles = async () => {
  try {
    const response = await axiosInstance.get("/api/articles/get-popular-articles");
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

export const getTopArticlesByMonth = async (month: number, year: number) => {
  try {
    const response = await axiosInstance.get(`/api/articles/journalist-get-monthly-top?month=${month}&year=${year}`);
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

export const adminGetJournalistsAnalytics = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/api/articles/journalist/${userId}/analytics`);
    return response.data
  } catch (error) {
    return handleError(error);
  }
}