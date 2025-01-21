import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine } from 'lucide-react';

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Share Your Knowledge with the World
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Write, share, and engage with a community of developers. Start your blogging journey today.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/page/register">
            <Button size="lg">
              Start Writing
              <PenLine className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/page/posts">
            <Button variant="outline" size="lg">
              Explore Posts
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with Next.js 13</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Learn how to build modern web applications with Next.js 13 and its powerful features.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/posts/1">
                <Button variant="ghost">Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}