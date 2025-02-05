import { useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../api/firebase";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";

export const useTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const getTasksRef = useCallback(() => {
    if (!currentUser?.uid) {
      throw new Error("Kullanıcı oturumu bulunamadı");
    }
    return collection(firestore, "users", currentUser.uid, "tasks");
  }, [currentUser]);

  const getCompletedTasks = useCallback(async () => {
    setLoading(true);
    try {
      const tasksRef = getTasksRef();
      const q = query(tasksRef, where("status", "==", "Completed"));
      const snapshot = await getDocs(q);
      return snapshot;
    } catch (err) {
      setError(err.message);
      toast.error("Tamamlanan görevler yüklenirken hata oluştu");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getTasksRef]);

  const getTodaysTasks = useCallback(async () => {
    setLoading(true);
    try {
      const tasksRef = getTasksRef();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const q = query(
        tasksRef,
        where("assignedOn", ">=", Timestamp.fromDate(today)),
        where("assignedOn", "<", Timestamp.fromDate(tomorrow))
      );
      return await getDocs(q);

    } catch (err) {
      setError(err.message);
      toast.error("Günlük görevler yüklenirken hata oluştu");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getTasksRef]);

  const calculateTaskStats = useCallback(async () => {
    setLoading(true);
    try {
      const tasksRef = getTasksRef();
      const allTasks = await getDocs(tasksRef);
      const totalTasks = allTasks.size;

      if (totalTasks === 0) {
        return { completed: 0, inProgress: 0, notStarted: 0 };
      }

      const statuses = ["Completed", "In Progress", "Not Started"];
      const counts = await Promise.all(
        statuses.map(async (status) => {
          const q = query(tasksRef, where("status", "==", status));
          const snapshot = await getDocs(q);
          return snapshot.size;
        })
      );

      return {
        completed: Math.round((counts[0] / totalTasks) * 100),
        inProgress: Math.round((counts[1] / totalTasks) * 100),
        notStarted: Math.round((counts[2] / totalTasks) * 100),
      };
    } catch (err) {
      setError(err.message);
      toast.error("Görev istatistikleri hesaplanırken hata oluştu");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getTasksRef]);

  const addTask = useCallback(
    async (taskData) => {
      setLoading(true);
      try {
        const tasksRef = getTasksRef();
        const newTask = {
          ...taskData,
          createdOn: Timestamp.now(),
        };
        const docRef = await addDoc(tasksRef, newTask);
        toast.success("Görev başarıyla eklendi");
        return docRef;
      } catch (err) {
        setError(err.message);
        toast.error("Görev eklenirken hata oluştu");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getTasksRef]
  );

  const updateTask = useCallback(
    async (taskId, taskData) => {
      setLoading(true);
      try {
        const taskRef = doc(getTasksRef(), taskId);
        await updateDoc(taskRef, {
          ...taskData,
          updatedOn: Timestamp.now(),
        });
        toast.success("Görev başarıyla güncellendi");
      } catch (err) {
        setError(err.message);
        toast.error("Görev güncellenirken hata oluştu");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getTasksRef]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      setLoading(true);
      try {
        const taskRef = doc(getTasksRef(), taskId);
        await deleteDoc(taskRef);
        toast.success("Görev başarıyla silindi");
      } catch (err) {
        setError(err.message);
        toast.error("Görev silinirken hata oluştu");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getTasksRef]
  );

  const getAllTasks = useCallback(async () => {
    setLoading(true);
    try {
      const tasksRef = getTasksRef();
      const snapshot = await getDocs(tasksRef);
      return snapshot;
    } catch (err) {
      setError(err.message);
      toast.error("Görevler yüklenirken hata oluştu");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getTasksRef]);

  /* const getTodayExtremeTasks = useCallback(async () => {
    setLoading(true);
    try {
      const tasksRef = getTasksRef();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const q = query(
        tasksRef,
        where("assignedOn", ">=", Timestamp.fromDate(today)),
        where("assignedOn", "<", Timestamp.fromDate(tomorrow))
      );
      
      const extremeTasks = query(q, where("priority", "==", "Extreme"));
      const extremeTasksSnapshot = await getDocs(extremeTasks);
      const extremeTasksTitles = extremeTasksSnapshot.docs.map((doc) => doc.data().title);
      return extremeTasksTitles;
    } catch (err) {
      setError(err.message);

      toast.error("Günlük görevler yüklenirken hata oluştu");

      throw err;
    } finally {
      setLoading(false);
    }
  }, [getTasksRef]); */
  

  return {
    loading,
    error,
    getCompletedTasks,
    getTodaysTasks,
    calculateTaskStats,
    addTask,
    updateTask,
    deleteTask,
    getAllTasks,
    // getTodayExtremeTasks,
  };
};
