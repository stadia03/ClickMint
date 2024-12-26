import {create} from 'zustand';


type userStore = {
  address: string,
  setUseraddress: (address : string) => void;

  isAuth: boolean,
  setAuth: (isLogin : boolean) =>void;



}

export  const useUserStore = create<userStore>((set)=>({
  address: '',
  setUseraddress: (address : string) => set({address: address}),

  isAuth : false,
  setAuth: ( isAuth : boolean)=> set({isAuth})
}))