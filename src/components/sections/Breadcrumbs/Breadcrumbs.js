'use server'
import styles from "./breadcrumbs.module.css";
import Image from "next/image";
import Link from 'next/link';
import React from 'react';

export default async function Breadcrumbs({ data = [] }) {
    return (
        <section className={styles.breadcrumbs}>
            {data && data.length > 0 && (
                <>
                    <div className={styles.breadcrumbs}>
                        {data.map((crumb, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <span className={styles.breadcrumbSeparator}> / </span>}

                                {index < data.length - 1 ? (
                                    // Все элементы кроме последнего - ссылки (если есть path)
                                    crumb.path ? (
                                        <Link href={crumb.path} className={styles.breadcrumbLink}>
                                            {crumb.title}
                                        </Link>
                                    ) : (
                                        <span className={styles.breadcrumbLink}>
                                            {crumb.title}
                                        </span>
                                    )
                                ) : (
                                    // Последний элемент - span, но с сохранением path в данных (если есть)
                                    <span
                                        className={styles.breadcrumbCurrent}
                                        {...(crumb.path ? { 'data-path': crumb.path } : {})}
                                    >
                                        {crumb.title}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "BreadcrumbList",
                                "itemListElement": data.filter(crumb => crumb.path !== null).map((crumb, index) => ({
                                    "@type": "ListItem",
                                    "position": index + 1,
                                    "name": crumb.title,
                                    "item": crumb.path ? `${typeof window !== 'undefined' ? window.location.origin : process.env.SITE_URL}${crumb.path}` : undefined
                                })).filter(item => item.item)
                            })
                        }}
                    />
                </>
            )}
        </section>
    )
}