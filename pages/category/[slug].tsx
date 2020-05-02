import { NextPage } from 'next'
import { Rest } from '../../utils/api'
import omit from 'lodash/omit'
import { CategoryModel } from '../../models/dto/category'
import { ArticleLayout } from '../../layouts/ArticleLayout'
import Link from 'next/link'
import { QueueAnim } from '../../components/Anime'

interface CategoryListViewProps {
  category: CategoryModel
  children: {
    _id: string
    title: string
    slug: string
    created: string
  }[]
}

const CategoryListView: NextPage<CategoryListViewProps> = (props) => {
  const { category, children } = props

  return (
    <ArticleLayout
      title={'分类 - ' + category.name}
      subtitle={'当前共有' + children.length + '篇文章, 加油!'}
    >
      <article className="post-content paul-note article-list">
        <ul>
          <QueueAnim delay={700} forcedReplay appear>
            {children.map((child) => {
              const date = new Date(child.created)

              return (
                <li key={child._id}>
                  <Link
                    href={'/posts/[category]/[slug]'}
                    as={`/posts/${category.slug}/${child.slug}`}
                  >
                    <a>{child.title}</a>
                  </Link>
                  <span className={'meta'}>
                    {(date.getMonth() + 1).toString().padStart(2, '0')}/
                    {date.getDate().toString().padStart(2, '0')}/
                    {date.getFullYear()}
                  </span>
                </li>
              )
            })}
          </QueueAnim>
        </ul>
      </article>
    </ArticleLayout>
  )
}

CategoryListView.getInitialProps = async (ctx) => {
  const { query, res } = ctx

  const { slug } = query
  const resp = (await Rest('Category').get(slug as string)) as any

  return {
    category: omit(resp.data, ['children']),
    children: resp.data.children || [],
  } as any
}

export default CategoryListView