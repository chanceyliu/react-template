import { FC } from 'react'

interface IProps {
  title: string
}

const Hello: FC<IProps> = (props) => {
  return <div>hello{props.title}</div>
}

export default Hello
