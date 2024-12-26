import {create} from 'zustand';


type userStore = {
  address: string,
  setWorkeraddress: (address : string) => void;

  isAuth: boolean,
  setAuth: (isLogin : boolean) =>void;



}

export  const useUserStore = create<userStore>((set)=>({
  address: '',
  setWorkeraddress: (address : string) => set({address: address}),

  isAuth : false,
  setAuth: ( isAuth : boolean)=> set({isAuth})
}))