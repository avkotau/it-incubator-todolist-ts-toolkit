import { useDispatch } from "react-redux";
import { AppDispatch } from "common/store";
export const useAppDispatch = () => useDispatch<AppDispatch>();
