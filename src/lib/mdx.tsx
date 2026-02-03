import Image from "next/image";
import Link from "next/link";
import React from "react";

// DocuBook Markdown Components
import Accordion from "@/components/markdown/AccordionMdx";
import AccordionGroup from "@/components/markdown/AccordionGroupMdx";
import Button from "@/components/markdown/ButtonMdx";
import Card from "@/components/markdown/CardMdx";
import CardGroup from "@/components/markdown/CardGroupMdx";
import { Pre } from "@/components/markdown/CodeBlockMdx";
import { Kbd } from "@/components/markdown/KeyboardMdx";
import { Stepper, StepperItem } from "@/components/markdown/StepperMdx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/markdown/TabsMdx";
import Tooltip from "@/components/markdown/TooltipMdx";
import Youtube from "@/components/markdown/YoutubeMdx";

function Table({ data }: { data: { headers: string[]; rows: string[][] } }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props: any) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props: any) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

// This replaces rehype-slug
function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: number) {
  const Heading = ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => {
    let slug = slugify((children || "") as string);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children
    );
  };
  Heading.displayName = `Heading${level}`;
  return Heading;
}


function ResponsiveTable(props: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto my-8">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  );
}

export const globalComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  Table,
  table: ResponsiveTable,
  pre: Pre,
  // DocuBook Markdown Components
  Accordion,
  AccordionGroup,
  Button,
  Card,
  CardGroup,
  Kbd,
  kbd: Kbd,
  Stepper,
  StepperItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  Youtube,
};

