import "../../css/Switch.css"


const SwitchButton = (props) => {

  return (
    <label className="switch">
      <input type="checkbox" {...props} />
      <span className="slider"></span>
    </label>
  )
}

export default SwitchButton;