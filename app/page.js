'use client';
import {useCateringPresenter} from './presenters/useCateringPresenter';
import CateringView from './views/CateringView';
export default function CateringPage() {return <CateringView presenter={useCateringPresenter()} />;}
