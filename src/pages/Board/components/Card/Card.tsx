import { JSX, useState } from 'react';

interface propsCard {
    title: string;
}

export function Card(props: propsCard): JSX.Element {
    return <li>{props.title}</li>;
}