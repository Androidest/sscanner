import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components'
import * as tf from "@tensorflow/tfjs";
import './ResizingLayer';


function App() {
  const [model, setModel] = useState(null);
  const canvas = useRef(null);

  const getImage = (path)=> {
    return new Promise((resolve, reject)=>{
      var img = new Image();
      img.src = path;

      img.onload = () => {
        var output = tf.browser.fromPixels(img);
        resolve(output);
      }
    })
  }

  useEffect(()=>{
    tf.ready()
    .then(async ()=>{
      const tfmodel = await tf.loadLayersModel(process.env.PUBLIC_URL + "/edge_detector_MobileNetV2/model.json")

      let img = await getImage(process.env.PUBLIC_URL + "/test.jpg")

      const w= 1080, h = 486;
      img = img.resizeBilinear([h, w])
      img = img.reshape([1, h, w, 3]).div(127.5).sub(1)
      img = tfmodel.predict(img)
      img = img.greater(0).mul(1.0)
      // img = tf.sigmoid(img)
      img = img.reshape([h, w, 1])
      tf.browser.toPixels(img, canvas.current)

      setModel(tfmodel)
      // setResult(img)
    })
  }, [])


  return (
    <AppContainer>
      <Img src={process.env.PUBLIC_URL + "/test.jpg"} />
      <Canvas ref={canvas} />
    </AppContainer>
  );
}

const Img = styled.img`
  max-width: 800px;
`

const Canvas = styled.canvas`
  max-width: 800px;
  max-height: 800px;
`
const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`

export default App;
