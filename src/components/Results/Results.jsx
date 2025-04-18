import React, { useState, useEffect } from "react";
import styles from './Results.module.css';

const Results = ({ searchData }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [histograms, setHistograms] = useState([]);
    const [publications, setPublications] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const histogramsResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify({
                        issueDateInterval: {
                            startDate: searchData.startDate,
                            endDate: searchData.endDate,
                        },
                        searchContext: {
                            targetSearchEntitiesContext: {
                                targetSearchEntities: [{
                                    type: "company",
                                    inn: searchData.inn,
                                    maxFullness: searchData.maxFullness,
                                }],
                                onlyMainRole: searchData.onlyMainRole,
                                tonality: searchData.tonality,
                                onlyWithRiskFactors: searchData.onlyWithRiskFactors,
                            },
                        },
                        limit: searchData.limit,
                        intervalType: "month",
                        histogramTypes: ["totalDocuments", "riskFactors"],
                    }),
                });
                const histogramsData = await histogramsResponse.json();
                setHistograms(histogramsData.data || []);

                const publicationsResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify({
                        issueDateInterval: {
                            startDate: searchData.startDate,
                            endDate: searchData.endDate,
                        },
                        searchContext: {
                            targetSearchEntitiesContext: {
                                targetSearchEntities: [{
                                    type: "company",
                                    inn: searchData.inn,
                                    maxFullness: searchData.maxFullness,
                                }],
                                onlyMainRole: searchData.onlyMainRole,
                                tonality: searchData.tonality,
                                onlyWithRiskFactors: searchData.onlyWithRiskFactors,
                            },
                        },
                        limit: searchData.limit,
                    }),
                });
                const publicationsData = await publicationsResponse.json();
                const publicationIds = publicationsData.items.map(item => item.encodedId);

                const documentsResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/documents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify({ ids: publicationIds.slice(0, 100) }),
                });
                const documentsData = await documentsResponse.json();
                setPublications(documentsData.map(doc => doc.ok).filter(Boolean));
            } catch (err) {
                setError("Ошибка загрузки данных. Пожалуйста, попробуйте позже.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchData]);

    const loadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p>Загрузка данных...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.results}>
            <h2>Результаты поиска</h2>
            
            <div className={styles.histograms}>
                <h3>Общая сводка</h3>
                <div className={styles.histogramCarousel}>
                    {histograms.map((histogram, index) => (
                        <div key={index} className={styles.histogramItem}>
                            <h4>{histogram.histogramType === 'totalDocuments' ? 'Всего документов' : 'Риск-факторы'}</h4>
                            <ul>
                                {histogram.data.slice(0, 5).map((item, i) => (
                                    <li key={i}>
                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                        <span>{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.publications}>
                <h3>Список документов ({publications.length})</h3>
                {publications.slice(0, visibleCount).map((pub, index) => (
                    <div key={index} className={styles.publicationCard}>
                        <div className={styles.publicationHeader}>
                            <span className={styles.publicationDate}>
                                {new Date(pub.issueDate).toLocaleDateString()}
                            </span>
                            <a href={pub.url} target="_blank" rel="noopener noreferrer" className={styles.publicationSource}>
                                {pub.source?.name || "Неизвестный источник"}
                            </a>
                        </div>
                        <h4 className={styles.publicationTitle}>{pub.title?.text || "Без названия"}</h4>
                        <div className={styles.publicationTags}>
                            {pub.attributes?.isTechNews && <span className={styles.tag}>Технические новости</span>}
                            {pub.attributes?.isAnnouncement && <span className={styles.tag}>Анонсы</span>}
                            {pub.attributes?.isDigest && <span className={styles.tag}>Сводки</span>}
                        </div>
                        <div className={styles.publicationContent}>
                            {pub.content?.markup && (
                                <div dangerouslySetInnerHTML={{ __html: pub.content.markup }} />
                            )}
                        </div>
                        <div className={styles.publicationFooter}>
                            <a href={pub.url} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
                                Читать в источнике
                            </a>
                            <span className={styles.wordCount}>{pub.attributes?.wordCount || 0} слов</span>
                        </div>
                    </div>
                ))}
            </div>

            {visibleCount < publications.length && (
                <button onClick={loadMore} className={styles.loadMoreButton}>
                    Показать больше ({publications.length - visibleCount})
                </button>
            )}
        </div>
    );
};

export default Results;
