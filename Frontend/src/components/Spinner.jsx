import MoonLoader from "react-spinners/MoonLoader";
import BarLoader from "react-spinners/BarLoader";
import BeatLoader from "react-spinners/BeatLoader";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import RingLoader from "react-spinners/RingLoader";
import { AppStore } from '../store/AppStore';
import Layout from "@/components/Layout.jsx";

const Spinner = () => {
  return (
    <>
      <div
        className="spinner bg-backimg bg-cover bg-center bg-no-repeat overflow-auto"
        style={{ width: '100vw', height: '100vh', position: 'absolute',zIndex: '10',left: '0',top: '0',right: '0',bottom: '0',display: 'block'}}
      >
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
          <RingLoader
            color="red"
            loading={AppStore.isRunnig}
            size={100}
          />
        </div>
      </div>
    </>
  );
};

export default Spinner;