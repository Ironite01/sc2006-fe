import { profile } from '../assets';
import { USER_ROLES } from '../helpers/constants';
import SubmitButton from './SubmitButton';
import './UserForm.css';

export default function UserForm({ updateMode, formData, setFormData, submitButtonLabel, onFormSubmit, currentPicture, setCurrentPicture, submitButtonColor, title, children }) {
    function onPictureChange(e) {
        setCurrentPicture(URL.createObjectURL(e.target.files[0]));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (<form onSubmit={onFormSubmit} className='userForm'>
        {title}
        <label htmlFor='profilePicture' className='profilePicture'>
            <img width={100} height={100} src={currentPicture || profile} alt="Profile logo" className='overflow-hidden rounded-[3rem]' />
            <span className='bg-[#fff] p-[0.5rem] ml-[-1.5rem] rounded-[0.4rem]'>+</span>
        </label>
        <input type='file' accept="image/png, image/jpeg" id="profilePicture" name="profilePicture" onChange={onPictureChange} hidden />

        <div className='form-field'>
            <label htmlFor='username'>Username <span className='text-[#F54927]'>*</span></label>
            <input id="username" name="username" placeholder='Choose a username' value={formData?.username || undefined} onChange={updateMode ? handleChange : undefined} />
        </div>

        <div className='form-field'>
            <label>I am a: <span className='text-[#F54927]'>*</span></label>
            <div className='radio-group'>
                <div>
                    <input type="radio" id={USER_ROLES.SUPPORTER} name='role' defaultChecked value={USER_ROLES.SUPPORTER} disabled={updateMode} />
                    <label htmlFor={USER_ROLES.SUPPORTER}>Supporter</label>
                </div>
                <div>
                    <input type="radio" id={USER_ROLES.BUSINESS_REPRESENTATIVE} name="role" value={USER_ROLES.BUSINESS_REPRESENTATIVE} checked={updateMode ? formData?.role === USER_ROLES.BUSINESS_REPRESENTATIVE : undefined} disabled={updateMode} />
                    <label htmlFor={USER_ROLES.BUSINESS_REPRESENTATIVE}>Business Representative</label>
                </div>
            </div>
            {updateMode && <label className="role-label">Please contact administrator to update role!</label>}
        </div>

        <div className='form-field'>
            <label htmlFor='email'>Email <span className='text-[#F54927]'>*</span></label>
            <input id="email" name="email" type='email' placeholder='your@email.com' value={formData?.email || undefined} onChange={updateMode ? handleChange : undefined} />
        </div>

        {updateMode && <div className='form-field'>
            <label htmlFor='currentPassword'>Current Password <span className='text-[#F54927]'>*</span></label>
            <input id="currentPassword" name="currentPassword" type='password' placeholder='Current password' />
        </div>}

        <div className='form-field'>
            <label htmlFor='password'>New Password <span className='text-[#F54927]'>*</span></label>
            <input id="password" name="password" type='password' placeholder='Create a strong password' />
        </div>

        <div className='form-field'>
            <label htmlFor='cpassword'>Confirm New Password <span className='text-[#F54927]'>*</span></label>
            <input id="cpassword" name="cpassword" type='password' placeholder='Confirm your password' />
        </div>

        <SubmitButton type="submit" className={`bg-[${submitButtonColor}]`}>{submitButtonLabel}</SubmitButton>

        {children}
    </form>);
}