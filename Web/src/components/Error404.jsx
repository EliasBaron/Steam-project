import '../styles/styles.css';
import imgError from '../assets/img-error.jpg';

export default function Error404() {
  return (
    <div className='img-error-container'>
      <img src={imgError} alt='Error 404' className='img-error' />
    </div>
  );
}